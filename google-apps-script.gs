/**
 * =====================================================================
 *  APARTMAN FOGLALÁSI RENDSZER – Google Apps Script backend
 * =====================================================================
 *  Mit csinál:
 *   - A foglalásokat egy Google Táblázatban ("Foglalások" lap) tárolja.
 *   - Visszaadja a weboldalnak a foglalt időszakokat (személyes adat nélkül).
 *   - Új foglaláskor a SZERVER ellenőrzi, hogy szabad-e az időszak, és
 *     a SZERVER számolja az árat (a böngészőből jövő árat nem fogadja el).
 *   - A távozás napja = a következő vendég érkezési napja lehet
 *     (szept. 9–15. foglalás mellett szept. 15-én új vendég érkezhet).
 *   - Bankkártya: Stripe Checkout (Stripe biztonságos fizetőoldala).
 *   - Átutalás: e-mailben elküldi az utalási adatokat.
 *   - E-mail értesítés neked és a vendégnek, opcionálisan Google Naptár bejegyzés.
 *
 *  Beállítás: lásd a "BOOKING-SETUP.md" leírást.
 *  Projektbeállítások → Szkript tulajdonságai (Script properties):
 *     STRIPE_SECRET_KEY  sk_test_... (teszt) vagy sk_live_... (éles)   – kötelező a kártyás fizetéshez
 *     OWNER_EMAIL        ide jönnek az értesítők                         – ajánlott
 *     BANK_DETAILS       utalási adatok szövege (név, IBAN, bank)        – ajánlott
 *     SITE_URL           pl. https://www.sajatdomain.hu                  – ajánlott (biztonság)
 *     CALENDAR_ID        Google Naptár azonosító                          – opcionális
 *     SHEET_ID           a setup() automatikusan kitölti
 * =====================================================================
 */

/* ------------------------- ÁRAK / APARTMANOK ------------------------- */
// Ha árat változtatsz, a weboldalon (apartmanX.html → BOOKING_CONFIG) is írd át!
const APARTMENTS = {
  ap1: { name: 'Apartman 1', nightly: 110, cleaning: 50, minNights: 1 },
  ap2: { name: 'Apartman 2', nightly: 135, cleaning: 50, minNights: 1 },
  ap3: { name: 'Apartman 3', nightly: 230, cleaning: 50, minNights: 1 },
};

const CURRENCY = 'eur';
const TZ = 'Europe/Zagreb';
const SHEET_NAME = 'Foglalások';
const MAX_NIGHTS = 60;
const HOLD_MINUTES = 35;          // ennyi ideig tartjuk fenn a dátumot kártyás fizetésre várva

const STATUS = {
  PENDING:   'FIZETÉSRE VÁR',     // kártyás, még nem fizetett (35 percig blokkol)
  PAID:      'FIZETVE',           // kártyával kifizetve
  TRANSFER:  'ÁTUTALÁSRA VÁR',    // átutalásos foglalás – blokkol
  CONFIRMED: 'VISSZAIGAZOLVA',    // kézzel jóváhagyott (pl. megjött az utalás)
  BLOCKED:   'ZÁRVA',             // kézi zárás (pl. Booking.com foglalás, saját használat)
  CANCELLED: 'LEMONDVA',          // nem blokkol
  EXPIRED:   'LEJÁRT',            // nem blokkol
  CONFLICT:  'FIZETVE – ÜTKÖZÉS!' // ritka eset: fizetett, de közben foglalt lett → téríts vissza
};

const HEADERS = ['ID', 'Apartman', 'Érkezés', 'Távozás', 'Éjszakák', 'Összeg (EUR)', 'Fizetési mód',
                 'Státusz', 'Név', 'Email', 'Telefon', 'Lakcím', 'Üzenet', 'Nyelv', 'Stripe session',
                 'Létrehozva', 'Lejárat'];
const C = {}; HEADERS.forEach((h, i) => C[h] = i);   // oszlop index név szerint

/* ============================ BELÉPÉSI PONTOK ============================ */

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    switch (p.action || 'bookings') {
      case 'bookings': return json_(getPublicBookings_(p.apartment));
      case 'confirm':  return json_(confirmStripeSession_(p.session_id));
      case 'cancel':   return json_(cancelPending_(p.booking));
      case 'ping':     return json_({ ok: true });
      default:         return json_({ ok: false, error: 'UNKNOWN_ACTION' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'SERVER_ERROR' });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'book') return json_(createBooking_(body));
    return json_({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'SERVER_ERROR' });
  }
}

/* ============================ FOGLALTSÁG ============================ */

function getPublicBookings_(apartment) {
  const apt = normalizeApartment_(apartment);
  if (!APARTMENTS[apt]) return { ok: false, error: 'UNKNOWN_APARTMENT' };
  const today = todayStr_();
  const list = readRows_()
    .filter(r => r.apartment === apt && isBlocking_(r) && r.end > today)
    .map(r => ({ start: r.start, end: r.end }));     // csak dátumok, személyes adat nincs
  return { ok: true, bookings: list };
}

/** Blokkolja-e a sor a naptárat. Üres státusz = kézzel beírt foglalás → blokkol. */
function isBlocking_(r) {
  if (!r.start || !r.end) return false;
  if (r.status === STATUS.PENDING) return r.expires && new Date().getTime() < r.expires.getTime();
  return [STATUS.PAID, STATUS.TRANSFER, STATUS.CONFIRMED, STATUS.BLOCKED, STATUS.CONFLICT, ''].indexOf(r.status) !== -1;
}

/** Ütközés: [start, end) intervallumok. A távozás napja szabad érkezésre (szigorú <). */
function overlaps_(rows, apt, start, end, ignoreId) {
  return rows.some(r => r.apartment === apt && r.id !== ignoreId && isBlocking_(r) && r.start < end && start < r.end);
}

/* ============================ ÚJ FOGLALÁS ============================ */

function createBooking_(d) {
  const apt = normalizeApartment_(d.apartment);
  const cfg = APARTMENTS[apt];
  if (!cfg) return { ok: false, error: 'UNKNOWN_APARTMENT' };

  const start = String(d.start || ''), end = String(d.end || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return { ok: false, error: 'BAD_DATES' };
  if (start < todayStr_() || end <= start) return { ok: false, error: 'BAD_DATES' };
  const nights = nightsBetween_(start, end);
  if (nights < cfg.minNights) return { ok: false, error: 'MIN_NIGHTS' };
  if (nights > MAX_NIGHTS) return { ok: false, error: 'BAD_DATES' };

  const guest = {
    name: clean_(d.name, 120), email: clean_(d.email, 160), phone: clean_(d.phone, 60),
    address: clean_(d.address, 300), message: clean_(d.message, 2000),
    lang: ['hu', 'en', 'de', 'hr'].indexOf(d.lang) !== -1 ? d.lang : 'hu',
  };
  if (!guest.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) return { ok: false, error: 'BAD_INPUT' };

  const method = d.paymentMethod === 'card' ? 'card' : 'transfer';
  const props = PropertiesService.getScriptProperties();
  if (method === 'card' && !props.getProperty('STRIPE_SECRET_KEY')) return { ok: false, error: 'PAYMENT_NOT_CONFIGURED' };

  let returnUrl = null;
  if (method === 'card') {
    returnUrl = validReturnUrl_(d.returnUrl);
    if (!returnUrl) return { ok: false, error: 'BAD_RETURN_URL' };
  }

  const amount = nights * cfg.nightly + cfg.cleaning;   // ár a szerveren számolva
  const id = newId_();
  const now = new Date();
  const booking = {
    id, apartment: apt, start, end, nights, amount, method,
    status: method === 'card' ? STATUS.PENDING : STATUS.TRANSFER,
    created: now,
    expires: method === 'card' ? new Date(now.getTime() + HOLD_MINUTES * 60000) : '',
  };

  // Zárolás: két egyszerre érkező foglalás ne kaphassa meg ugyanazt az időszakot
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (overlaps_(readRows_(), apt, start, end)) return { ok: false, error: 'DATES_TAKEN' };
    appendRow_(booking, guest);
  } finally {
    lock.releaseLock();
  }

  if (method === 'card') {
    try {
      const session = createCheckoutSession_(booking, guest, cfg, returnUrl);
      updateRow_(id, { 'Stripe session': session.id });
      return { ok: true, bookingId: id, checkoutUrl: session.url };
    } catch (err) {
      console.error('Stripe hiba: ' + err);
      updateRow_(id, { 'Státusz': STATUS.EXPIRED });
      return { ok: false, error: 'PAYMENT_ERROR' };
    }
  }

  // Átutalás
  safe_(() => sendGuestEmail_(booking, guest, cfg, 'transfer'));
  safe_(() => sendOwnerEmail_(booking, guest, cfg, 'Új foglalás – átutalásra vár'));
  safe_(() => addCalendarEvent_(booking, guest, cfg));
  return { ok: true, bookingId: id, status: 'transfer' };
}

/* ============================ STRIPE ============================ */

function createCheckoutSession_(b, guest, cfg, returnUrl) {
  const sep = returnUrl.indexOf('?') === -1 ? '?' : '&';
  return stripe_('post', '/checkout/sessions', {
    'mode': 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': CURRENCY,
    'line_items[0][price_data][unit_amount]': String(Math.round(b.amount * 100)),
    'line_items[0][price_data][product_data][name]': `${cfg.name}: ${b.start} → ${b.end}`,
    'line_items[0][price_data][product_data][description]':
        `${b.nights} × ${cfg.nightly} € + ${cfg.cleaning} € (takarítás / cleaning)`,
    'customer_email': guest.email,
    'client_reference_id': b.id,
    'metadata[booking_id]': b.id,
    'metadata[apartment]': cfg.name,
    'payment_intent_data[metadata][booking_id]': b.id,
    'payment_intent_data[description]': `${cfg.name} ${b.start} – ${b.end} (${b.id})`,
    'success_url': `${returnUrl}${sep}payment=success&session_id={CHECKOUT_SESSION_ID}`,
    'cancel_url': `${returnUrl}${sep}payment=cancelled&booking=${b.id}`,
    'expires_at': String(Math.floor(Date.now() / 1000) + 31 * 60),   // Stripe minimum: 30 perc
    'locale': guest.lang,
  });
}

/**
 * Fizetés ellenőrzése. A böngészőből csak a session azonosító jön –
 * a fizetés tényét MINDIG közvetlenül a Stripe-tól kérdezzük le.
 */
function confirmStripeSession_(sessionId) {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(String(sessionId || ''))) return { ok: false, error: 'BAD_SESSION' };
  const s = stripe_('get', '/checkout/sessions/' + encodeURIComponent(sessionId));
  const id = s.client_reference_id || (s.metadata && s.metadata.booking_id);
  if (!id) return { ok: false, error: 'NOT_FOUND' };

  if (s.payment_status !== 'paid') {
    return { ok: true, bookingId: id, status: s.status === 'expired' ? 'expired' : 'pending' };
  }

  let row, newlyPaid = false;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const rows = readRows_();
    row = rows.find(r => r.id === id);
    if (!row || row.session !== s.id) return { ok: false, error: 'NOT_FOUND' };
    if (Math.round(row.amount * 100) !== s.amount_total) console.warn('Összeg eltérés: ' + id);

    if (row.status === STATUS.PENDING || row.status === STATUS.EXPIRED) {
      // ha a tartás közben lejárt és valaki más foglalt rá → ütközés, kézi visszatérítés kell
      const clash = row.status === STATUS.EXPIRED && overlaps_(rows, row.apartment, row.start, row.end, row.id);
      row.status = clash ? STATUS.CONFLICT : STATUS.PAID;
      updateRow_(id, { 'Státusz': row.status, 'Lejárat': '' });
      newlyPaid = true;
    }
  } finally {
    lock.releaseLock();
  }

  if (newlyPaid) {
    const cfg = APARTMENTS[row.apartment];
    const guest = row.guest;
    if (row.status === STATUS.CONFLICT) {
      safe_(() => sendOwnerEmail_(row, guest, cfg, '⚠️ FIGYELEM: fizetett foglalás ütközik – visszatérítés szükséges'));
    } else {
      safe_(() => sendGuestEmail_(row, guest, cfg, 'paid'));
      safe_(() => sendOwnerEmail_(row, guest, cfg, 'Új foglalás – kártyával FIZETVE'));
      safe_(() => addCalendarEvent_(row, guest, cfg));
    }
  }
  return { ok: true, bookingId: id, status: row.status === STATUS.CONFLICT ? 'pending' : 'paid' };
}

/** A vendég a Stripe oldalon a "Vissza" gombot nyomta → felszabadítjuk a dátumot. */
function cancelPending_(bookingId) {
  if (!/^[A-Z0-9-]{6,30}$/.test(String(bookingId || ''))) return { ok: false, error: 'BAD_ID' };
  const row = readRows_().find(r => r.id === bookingId);
  if (!row) return { ok: false, error: 'NOT_FOUND' };
  if (row.status !== STATUS.PENDING) {
    return { ok: true, bookingId, status: row.status === STATUS.PAID ? 'paid' : 'cancelled' };
  }
  if (row.session) {
    try {
      stripe_('post', '/checkout/sessions/' + encodeURIComponent(row.session) + '/expire', {});
    } catch (err) {
      // nem lehetett lezárni → lehet, hogy közben kifizette
      const res = confirmStripeSession_(row.session);
      if (res.status === 'paid') return res;
    }
  }
  updateRow_(bookingId, { 'Státusz': STATUS.EXPIRED });
  return { ok: true, bookingId, status: 'cancelled' };
}

/**
 * Biztonsági háló (10 percenként fut, a setup() telepíti):
 * ha a vendég fizetés után bezárta a böngészőt, itt akkor is visszaigazolódik,
 * a lejárt, ki nem fizetett tartások pedig felszabadulnak.
 */
function reconcilePending() {
  const rows = readRows_().filter(r => r.status === STATUS.PENDING);
  rows.forEach(r => {
    try {
      if (r.session) {
        const res = confirmStripeSession_(r.session);
        if (res.status === 'paid') return;
      }
      if (!r.expires || new Date() > r.expires) updateRow_(r.id, { 'Státusz': STATUS.EXPIRED });
    } catch (err) {
      console.error('reconcile ' + r.id + ': ' + err);
    }
  });
}

function stripe_(method, path, payload) {
  const key = PropertiesService.getScriptProperties().getProperty('STRIPE_SECRET_KEY');
  if (!key) throw new Error('STRIPE_SECRET_KEY nincs beállítva');
  const opts = { method, headers: { Authorization: 'Bearer ' + key }, muteHttpExceptions: true };
  if (payload && method !== 'get') opts.payload = payload;
  const res = UrlFetchApp.fetch('https://api.stripe.com/v1' + path, opts);
  const data = JSON.parse(res.getContentText());
  if (res.getResponseCode() >= 300) throw new Error((data.error && data.error.message) || ('Stripe HTTP ' + res.getResponseCode()));
  return data;
}

function validReturnUrl_(url) {
  url = String(url || '');
  if (!/^https?:\/\/[^\s?#]+$/.test(url)) return null;
  const site = (PropertiesService.getScriptProperties().getProperty('SITE_URL') || '').replace(/\/+$/, '');
  if (site && url.indexOf(site + '/') !== 0 && url !== site) return null;   // csak a saját oldalra térhet vissza
  return url;
}

/* ============================ E-MAILEK ============================ */

const MAIL_TEXT = {
  hu: { subjPaid: 'Foglalás visszaigazolva', subjTransfer: 'Foglalási kérés – utalási adatok',
        hello: 'Kedves', paid: 'Köszönjük a foglalást! A bankkártyás fizetés sikeres volt, a foglalásod végleges.',
        transfer: 'Köszönjük a foglalási kérést! A foglalás az alábbi összeg beérkezésével válik véglegessé. Közleménynek kérjük, írd be a foglalási azonosítót.',
        apt: 'Apartman', arr: 'Érkezés', dep: 'Távozás', nights: 'Éjszakák', total: 'Összeg', id: 'Foglalási azonosító',
        bank: 'Utalási adatok', tax: 'Az idegenforgalmi adó a helyszínen fizetendő.', bye: 'Üdvözlettel' },
  en: { subjPaid: 'Booking confirmed', subjTransfer: 'Reservation request – bank details',
        hello: 'Dear', paid: 'Thank you for your booking! Your card payment was successful and your booking is confirmed.',
        transfer: 'Thank you for your reservation request! The booking becomes final once the amount below arrives. Please use the booking ID as payment reference.',
        apt: 'Apartment', arr: 'Check-in', dep: 'Check-out', nights: 'Nights', total: 'Amount', id: 'Booking ID',
        bank: 'Bank details', tax: 'Tourist tax is paid on site.', bye: 'Kind regards' },
  de: { subjPaid: 'Buchung bestätigt', subjTransfer: 'Buchungsanfrage – Bankdaten',
        hello: 'Liebe/r', paid: 'Vielen Dank für Ihre Buchung! Die Kartenzahlung war erfolgreich, Ihre Buchung ist bestätigt.',
        transfer: 'Vielen Dank für Ihre Anfrage! Die Buchung ist nach Eingang des untenstehenden Betrags verbindlich. Bitte geben Sie die Buchungs-ID als Verwendungszweck an.',
        apt: 'Apartment', arr: 'Anreise', dep: 'Abreise', nights: 'Nächte', total: 'Betrag', id: 'Buchungs-ID',
        bank: 'Bankdaten', tax: 'Die Kurtaxe wird vor Ort bezahlt.', bye: 'Mit freundlichen Grüßen' },
  hr: { subjPaid: 'Rezervacija potvrđena', subjTransfer: 'Upit za rezervaciju – podaci za uplatu',
        hello: 'Poštovani/a', paid: 'Hvala na rezervaciji! Plaćanje karticom je uspješno, rezervacija je potvrđena.',
        transfer: 'Hvala na upitu! Rezervacija postaje konačna po primitku iznosa u nastavku. Kao poziv na broj navedite ID rezervacije.',
        apt: 'Apartman', arr: 'Dolazak', dep: 'Odlazak', nights: 'Noćenja', total: 'Iznos', id: 'ID rezervacije',
        bank: 'Podaci za uplatu', tax: 'Boravišna pristojba plaća se na licu mjesta.', bye: 'Srdačan pozdrav' },
};

function sendGuestEmail_(b, guest, cfg, kind) {
  const t = MAIL_TEXT[guest.lang] || MAIL_TEXT.en;
  const bank = PropertiesService.getScriptProperties().getProperty('BANK_DETAILS') || '';
  const rows = [[t.id, b.id], [t.apt, cfg.name], [t.arr, b.start], [t.dep, b.end], [t.nights, b.nights], [t.total, b.amount + ' €']];
  let html = `<p>${t.hello} ${esc_(guest.name)}!</p><p>${kind === 'paid' ? t.paid : t.transfer}</p>` + table_(rows);
  if (kind === 'transfer' && bank) html += `<p><b>${t.bank}:</b><br>${esc_(bank).replace(/\n/g, '<br>')}</p>`;
  html += `<p>${t.tax}</p><p>${t.bye},<br>${esc_(ownerName_())}</p>`;
  MailApp.sendEmail({
    to: guest.email,
    subject: `${kind === 'paid' ? t.subjPaid : t.subjTransfer} – ${cfg.name} (${b.id})`,
    htmlBody: html,
    replyTo: ownerEmail_(),
    name: ownerName_(),
  });
}

function sendOwnerEmail_(b, guest, cfg, subject) {
  const rows = [['Azonosító', b.id], ['Apartman', cfg.name], ['Érkezés', b.start], ['Távozás', b.end],
                ['Éjszakák', b.nights], ['Összeg', b.amount + ' €'], ['Státusz', b.status],
                ['Név', guest.name], ['Email', guest.email], ['Telefon', guest.phone],
                ['Lakcím', guest.address], ['Üzenet', guest.message], ['Nyelv', guest.lang]];
  MailApp.sendEmail({
    to: ownerEmail_(),
    subject: `${subject}: ${cfg.name} ${b.start} → ${b.end}`,
    htmlBody: `<p>${esc_(subject)}</p>` + table_(rows) + '<p>A foglalási táblázatban a "Státusz" oszlopban tudod módosítani (pl. LEMONDVA → a dátum felszabadul).</p>',
    replyTo: guest.email,
  });
}

function addCalendarEvent_(b, guest, cfg) {
  const calId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  if (!calId) return;
  const cal = CalendarApp.getCalendarById(calId);
  if (!cal) return;
  cal.createAllDayEvent(`${cfg.name} – ${guest.name} (${b.status})`, toDate_(b.start), toDate_(b.end), {
    description: `Azonosító: ${b.id}\nÖsszeg: ${b.amount} €\nEmail: ${guest.email}\nTelefon: ${guest.phone}\n${guest.message || ''}`,
  });
}

/* ============================ TÁBLÁZAT ============================ */

function getSheet_() {
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss) {
    const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    if (!id) throw new Error('Futtasd egyszer a setup() függvényt!');
    ss = SpreadsheetApp.openById(id);
  }
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#f1e5c8');
    sh.setFrozenRows(1);
    sh.getRange(2, C['Érkezés'] + 1, sh.getMaxRows() - 1, 2).setNumberFormat('@');   // dátum szövegként
    sh.getRange(2, C['Státusz'] + 1, sh.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(STATUS).map(k => STATUS[k]), true)
        .setAllowInvalid(true).build());
  }
  return sh;
}

function readRows_() {
  const sh = getSheet_();
  const values = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const v = values[i];
    if (!v[C['Apartman']] && !v[C['Érkezés']]) continue;
    out.push({
      row: i + 1,
      id: String(v[C['ID']] || ''),
      apartment: normalizeApartment_(v[C['Apartman']]),
      start: normDate_(v[C['Érkezés']]),
      end: normDate_(v[C['Távozás']]),
      nights: Number(v[C['Éjszakák']]) || 0,
      amount: Number(v[C['Összeg (EUR)']]) || 0,
      method: String(v[C['Fizetési mód']] || ''),
      status: String(v[C['Státusz']] || '').trim(),
      session: String(v[C['Stripe session']] || ''),
      expires: v[C['Lejárat']] instanceof Date ? v[C['Lejárat']] : (v[C['Lejárat']] ? new Date(v[C['Lejárat']]) : null),
      guest: {
        name: String(v[C['Név']] || ''), email: String(v[C['Email']] || ''), phone: String(v[C['Telefon']] || ''),
        address: String(v[C['Lakcím']] || ''), message: String(v[C['Üzenet']] || ''), lang: String(v[C['Nyelv']] || 'hu'),
      },
    });
  }
  return out;
}

function appendRow_(b, g) {
  const sh = getSheet_();
  const row = new Array(HEADERS.length).fill('');
  row[C['ID']] = b.id;
  row[C['Apartman']] = APARTMENTS[b.apartment].name;
  row[C['Érkezés']] = b.start;
  row[C['Távozás']] = b.end;
  row[C['Éjszakák']] = b.nights;
  row[C['Összeg (EUR)']] = b.amount;
  row[C['Fizetési mód']] = b.method === 'card' ? 'Bankkártya (Stripe)' : 'Átutalás';
  row[C['Státusz']] = b.status;
  // a vendég által beírt szöveg mindig sima szövegként kerül be (ne lehessen képlet / szám)
  const txt = s => (s ? "'" + s : '');
  row[C['Név']] = txt(g.name);
  row[C['Email']] = txt(g.email);
  row[C['Telefon']] = txt(g.phone);
  row[C['Lakcím']] = txt(g.address);
  row[C['Üzenet']] = txt(g.message);
  row[C['Nyelv']] = g.lang;
  row[C['Létrehozva']] = b.created;
  row[C['Lejárat']] = b.expires;
  const r = sh.getLastRow() + 1;
  sh.getRange(r, C['Érkezés'] + 1, 1, 2).setNumberFormat('@');
  sh.getRange(r, 1, 1, HEADERS.length).setValues([row]);
  SpreadsheetApp.flush();
}

function updateRow_(id, changes) {
  const sh = getSheet_();
  const ids = sh.getRange(1, C['ID'] + 1, sh.getLastRow(), 1).getValues();
  for (let i = 1; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      Object.keys(changes).forEach(k => sh.getRange(i + 1, C[k] + 1).setValue(changes[k]));
      SpreadsheetApp.flush();
      return true;
    }
  }
  return false;
}

/* ============================ SEGÉDEK ============================ */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function todayStr_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }
function nightsBetween_(a, b) {
  const p = s => s.split('-').map(Number);
  const [y1, m1, d1] = p(a), [y2, m2, d2] = p(b);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
function toDate_(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function normDate_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  const m = String(v || '').trim().match(/^(\d{4})[.\-\/ ]+(\d{1,2})[.\-\/ ]+(\d{1,2})/);
  return m ? `${m[1]}-${('0' + m[2]).slice(-2)}-${('0' + m[3]).slice(-2)}` : '';
}
function normalizeApartment_(v) {
  const m = String(v || '').match(/(\d+)/);
  return m ? 'ap' + Number(m[1]) : '';
}
function newId_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'F-' + s;
}
function clean_(v, max) { return String(v || '').replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, max); }
function esc_(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function table_(rows) {
  return '<table style="border-collapse:collapse">' + rows.map(r =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc_(r[0])}</td><td style="padding:4px 0"><b>${esc_(r[1])}</b></td></tr>`).join('') + '</table>';
}
function ownerEmail_() {
  return PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
}
function ownerName_() {
  return PropertiesService.getScriptProperties().getProperty('OWNER_NAME') || 'Apartmanok';
}
function safe_(fn) { try { fn(); } catch (err) { console.error(err); } }

/* ============================ BEÁLLÍTÁS ============================ */

/**
 * EGYSZER futtasd le a szerkesztőből (Futtatás ▶ setup):
 *  - létrehozza a foglalási táblázatot (ha a szkript nem táblázathoz kötött),
 *  - engedélyt kér (táblázat, e-mail, külső kérés a Stripe felé, naptár),
 *  - telepíti a 10 percenkénti ellenőrzést.
 */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss && !props.getProperty('SHEET_ID')) {
    ss = SpreadsheetApp.create('Apartman foglalások');
    props.setProperty('SHEET_ID', ss.getId());
    console.log('Új foglalási táblázat: ' + ss.getUrl());
  }
  getSheet_();

  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'reconcilePending')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('reconcilePending').timeBased().everyMinutes(10).create();

  ['STRIPE_SECRET_KEY', 'OWNER_EMAIL', 'BANK_DETAILS', 'SITE_URL'].forEach(k => {
    if (!props.getProperty(k)) console.warn('Hiányzó szkript tulajdonság: ' + k);
  });
  if (props.getProperty('STRIPE_SECRET_KEY')) {
    const acct = stripe_('get', '/balance');
    console.log('Stripe kapcsolat OK (' + (acct.livemode ? 'ÉLES' : 'TESZT') + ' mód).');
  }
  console.log('Kész. Táblázat: ' + (ss ? ss.getUrl() : 'https://docs.google.com/spreadsheets/d/' + props.getProperty('SHEET_ID')));
}
