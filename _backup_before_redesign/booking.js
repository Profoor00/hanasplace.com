/* =====================================================================
   KÖZÖS FOGLALÁSI NAPTÁR + FIZETÉS  (Apartman 1, 2, 3)
   ---------------------------------------------------------------------
   - A távozás napja ugyanakkor a következő vendég érkezési napja lehet
     (pl. szept. 9–15. foglalás mellett szept. 15-től újra foglalható).
   - A foglalásokat a Google Apps Script tárolja (Google Táblázat),
     a böngészőben nincs semmilyen titkos kulcs.
   - Kártyás fizetés: Stripe biztonságos fizetőoldala (a kártyaadat
     soha nem érinti ezt a weboldalt).

   Az oldalon a booking.js ELŐTT ennyi kell:
     <script>
       window.BOOKING_CONFIG = { apartmentId: "ap1", apartmentName: "Apartman 1",
                                 nightlyPrice: 110, cleaningFee: 50 };
     </script>
   (Az árakat a szerver is ellenőrzi – lásd google-apps-script.gs)
   ===================================================================== */

// A Google Apps Script "Web app" URL-je (Telepítés → Telepítések kezelése)
const BOOKING_API_URL = "https://script.google.com/macros/s/AKfycbyq9AX7dAo0KdPAVEQwastUAymfU_3rLVr9Rg8EsrYUOgA_dtFR_pXEREhjIyUvPUXqBA/exec";

const BOOKING_CFG = Object.assign({
    apartmentId: "ap1",
    apartmentName: "Apartman 1",
    nightlyPrice: 0,
    cleaningFee: 50,
    minNights: 1,
    monthsAhead: 18
}, window.BOOKING_CONFIG || {});

/* ---------- Szövegek (4 nyelv) ---------- */
const BOOKING_TEXTS = {
    hu: {
        bk_loading: "Foglaltság betöltése…",
        bk_load_error: "A foglaltságot most nem sikerült betölteni. Választhatsz dátumot, a szabad helyet küldéskor ellenőrizzük.",
        bk_legend_free: "Szabad",
        bk_legend_booked: "Foglalt",
        bk_legend_change: "Érkezési / távozási nap",
        bk_hint_start: "Válaszd ki az érkezés napját.",
        bk_hint_end: "Most válaszd ki a távozás napját.",
        bk_hint_done: "Kiválasztva: {n} éjszaka. Új dátumhoz kattints egy másik érkezési napra.",
        bk_checkout_only: "Ezen a napon érkezik egy vendég – csak távozási napnak választható.",
        bk_nights: "{n} éj × {p} €",
        bk_cleaning: "Takarítási díj",
        bk_total: "Összesen",
        bk_tax_note: "Az idegenforgalmi adó a helyszínen, távozáskor fizetendő.",
        bk_pay_title: "Fizetési mód",
        bk_pay_card: "Online bankkártyás fizetés",
        bk_pay_card_desc: "Biztonságos fizetés a Stripe fizetőoldalán (Visa, Mastercard, Apple Pay, Google Pay). A kártyaadatokat mi nem látjuk és nem tároljuk.",
        bk_pay_transfer: "Banki átutalás",
        bk_pay_transfer_desc: "Az utalási adatokat e-mailben küldjük. A foglalás az összeg beérkezésével válik véglegessé.",
        bk_submit_card: "Tovább a biztonságos fizetéshez",
        bk_submit_transfer: "Foglalás elküldése",
        bk_sending: "Küldés…",
        bk_redirecting: "Átirányítás a fizetőoldalra…",
        bk_err_taken: "Sajnos ezt az időszakot közben valaki lefoglalta. Kérjük, válassz másik dátumot.",
        bk_err_generic: "Hiba történt a foglalás során. Kérjük, próbáld újra, vagy írj nekünk a Kapcsolat oldalon.",
        bk_err_payment: "A kártyás fizetés most nem érhető el. Kérjük, válaszd a banki átutalást, vagy próbáld később.",
        bk_err_min: "A minimális foglalás {n} éjszaka.",
        bk_ok_transfer: "Köszönjük! A foglalási kérést megkaptuk (azonosító: {id}). Az utalási adatokat e-mailben küldtük.",
        bk_ok_paid: "Sikeres fizetés! A foglalásod visszaigazolva (azonosító: {id}). A részleteket e-mailben is elküldtük.",
        bk_pay_checking: "Fizetés ellenőrzése…",
        bk_pay_pending: "A fizetés feldolgozás alatt van. Amint megérkezik, e-mailben visszaigazoljuk a foglalást.",
        bk_pay_cancelled: "A fizetés megszakadt, a foglalás nem jött létre. A dátumok újra szabadok.",
        bk_secure: "Biztonságos, titkosított fizetés"
    },
    en: {
        bk_loading: "Loading availability…",
        bk_load_error: "Availability could not be loaded right now. You can still pick dates; we check them when you submit.",
        bk_legend_free: "Available",
        bk_legend_booked: "Booked",
        bk_legend_change: "Arrival / departure day",
        bk_hint_start: "Select your check-in date.",
        bk_hint_end: "Now select your check-out date.",
        bk_hint_done: "Selected: {n} night(s). Click another check-in date to start over.",
        bk_checkout_only: "A guest arrives on this day – it can only be your check-out date.",
        bk_nights: "{n} night(s) × €{p}",
        bk_cleaning: "Cleaning fee",
        bk_total: "Total",
        bk_tax_note: "Tourist tax is paid on site at departure.",
        bk_pay_title: "Payment method",
        bk_pay_card: "Online card payment",
        bk_pay_card_desc: "Secure payment on Stripe's checkout page (Visa, Mastercard, Apple Pay, Google Pay). We never see or store your card details.",
        bk_pay_transfer: "Bank transfer",
        bk_pay_transfer_desc: "We will email you the bank details. The booking is final once the payment arrives.",
        bk_submit_card: "Continue to secure payment",
        bk_submit_transfer: "Send reservation request",
        bk_sending: "Sending…",
        bk_redirecting: "Redirecting to the payment page…",
        bk_err_taken: "Sorry, these dates have just been booked by someone else. Please choose other dates.",
        bk_err_generic: "Something went wrong. Please try again or contact us on the Contact page.",
        bk_err_payment: "Card payment is not available right now. Please choose bank transfer or try again later.",
        bk_err_min: "The minimum stay is {n} night(s).",
        bk_ok_transfer: "Thank you! We received your reservation request (ID: {id}). The bank details have been sent by email.",
        bk_ok_paid: "Payment successful! Your booking is confirmed (ID: {id}). We have also sent the details by email.",
        bk_pay_checking: "Checking payment…",
        bk_pay_pending: "Your payment is being processed. We will confirm your booking by email as soon as it arrives.",
        bk_pay_cancelled: "The payment was cancelled, no booking was made. The dates are available again.",
        bk_secure: "Secure, encrypted payment"
    },
    de: {
        bk_loading: "Verfügbarkeit wird geladen…",
        bk_load_error: "Die Verfügbarkeit konnte gerade nicht geladen werden. Sie können trotzdem Daten wählen – wir prüfen sie beim Absenden.",
        bk_legend_free: "Frei",
        bk_legend_booked: "Belegt",
        bk_legend_change: "An- / Abreisetag",
        bk_hint_start: "Wählen Sie Ihr Anreisedatum.",
        bk_hint_end: "Wählen Sie jetzt Ihr Abreisedatum.",
        bk_hint_done: "Ausgewählt: {n} Nacht/Nächte. Für neue Daten klicken Sie auf einen anderen Anreisetag.",
        bk_checkout_only: "An diesem Tag reist ein Gast an – nur als Abreisetag wählbar.",
        bk_nights: "{n} Nacht/Nächte × {p} €",
        bk_cleaning: "Reinigungsgebühr",
        bk_total: "Gesamt",
        bk_tax_note: "Die Kurtaxe wird vor Ort bei der Abreise bezahlt.",
        bk_pay_title: "Zahlungsart",
        bk_pay_card: "Online-Kartenzahlung",
        bk_pay_card_desc: "Sichere Zahlung auf der Stripe-Bezahlseite (Visa, Mastercard, Apple Pay, Google Pay). Wir sehen und speichern Ihre Kartendaten nicht.",
        bk_pay_transfer: "Banküberweisung",
        bk_pay_transfer_desc: "Die Bankdaten senden wir per E-Mail. Die Buchung ist nach Zahlungseingang verbindlich.",
        bk_submit_card: "Weiter zur sicheren Zahlung",
        bk_submit_transfer: "Buchungsanfrage senden",
        bk_sending: "Wird gesendet…",
        bk_redirecting: "Weiterleitung zur Bezahlseite…",
        bk_err_taken: "Dieser Zeitraum wurde leider gerade gebucht. Bitte wählen Sie andere Daten.",
        bk_err_generic: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.",
        bk_err_payment: "Kartenzahlung ist gerade nicht verfügbar. Bitte wählen Sie Banküberweisung oder versuchen Sie es später.",
        bk_err_min: "Der Mindestaufenthalt beträgt {n} Nacht/Nächte.",
        bk_ok_transfer: "Vielen Dank! Ihre Buchungsanfrage ist eingegangen (ID: {id}). Die Bankdaten wurden per E-Mail gesendet.",
        bk_ok_paid: "Zahlung erfolgreich! Ihre Buchung ist bestätigt (ID: {id}). Die Details haben wir auch per E-Mail gesendet.",
        bk_pay_checking: "Zahlung wird geprüft…",
        bk_pay_pending: "Ihre Zahlung wird verarbeitet. Sobald sie eingeht, bestätigen wir die Buchung per E-Mail.",
        bk_pay_cancelled: "Die Zahlung wurde abgebrochen, es wurde keine Buchung erstellt. Die Daten sind wieder frei.",
        bk_secure: "Sichere, verschlüsselte Zahlung"
    },
    hr: {
        bk_loading: "Učitavanje dostupnosti…",
        bk_load_error: "Dostupnost se trenutno ne može učitati. Možete odabrati datume, provjerit ćemo ih pri slanju.",
        bk_legend_free: "Slobodno",
        bk_legend_booked: "Zauzeto",
        bk_legend_change: "Dan dolaska / odlaska",
        bk_hint_start: "Odaberite datum dolaska.",
        bk_hint_end: "Sada odaberite datum odlaska.",
        bk_hint_done: "Odabrano: {n} noćenja. Za nove datume kliknite drugi dan dolaska.",
        bk_checkout_only: "Na ovaj dan dolazi gost – može biti samo vaš dan odlaska.",
        bk_nights: "{n} noć. × {p} €",
        bk_cleaning: "Čišćenje",
        bk_total: "Ukupno",
        bk_tax_note: "Boravišna pristojba plaća se na licu mjesta pri odlasku.",
        bk_pay_title: "Način plaćanja",
        bk_pay_card: "Online plaćanje karticom",
        bk_pay_card_desc: "Sigurno plaćanje na Stripe stranici za plaćanje (Visa, Mastercard, Apple Pay, Google Pay). Podatke o kartici ne vidimo i ne pohranjujemo.",
        bk_pay_transfer: "Bankovna uplata",
        bk_pay_transfer_desc: "Podatke za uplatu šaljemo e-mailom. Rezervacija je konačna po primitku uplate.",
        bk_submit_card: "Nastavi na sigurno plaćanje",
        bk_submit_transfer: "Pošalji upit za rezervaciju",
        bk_sending: "Slanje…",
        bk_redirecting: "Preusmjeravanje na stranicu za plaćanje…",
        bk_err_taken: "Nažalost, ovi datumi su upravo rezervirani. Molimo odaberite druge datume.",
        bk_err_generic: "Došlo je do pogreške. Pokušajte ponovno ili nas kontaktirajte.",
        bk_err_payment: "Plaćanje karticom trenutno nije dostupno. Odaberite bankovnu uplatu ili pokušajte kasnije.",
        bk_err_min: "Minimalni boravak je {n} noćenja.",
        bk_ok_transfer: "Hvala! Primili smo vaš upit (ID: {id}). Podatke za uplatu poslali smo e-mailom.",
        bk_ok_paid: "Plaćanje uspješno! Rezervacija je potvrđena (ID: {id}). Detalje smo poslali i e-mailom.",
        bk_pay_checking: "Provjera plaćanja…",
        bk_pay_pending: "Plaćanje se obrađuje. Čim stigne, potvrdit ćemo rezervaciju e-mailom.",
        bk_pay_cancelled: "Plaćanje je prekinuto, rezervacija nije napravljena. Datumi su ponovno slobodni.",
        bk_secure: "Sigurno, šifrirano plaćanje"
    }
};

if (typeof translations !== "undefined") {
    Object.keys(BOOKING_TEXTS).forEach(l => {
        translations[l] = translations[l] || {};
        Object.assign(translations[l], BOOKING_TEXTS[l]);
    });
}

function bkT(key, vars) {
    const lang = (typeof currentLang !== "undefined" && currentLang) || "hu";
    let s = (typeof translations !== "undefined" && translations[lang] && translations[lang][key])
        || (BOOKING_TEXTS[lang] && BOOKING_TEXTS[lang][key])
        || BOOKING_TEXTS.hu[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
}

/* ---------- Dátum segédek (YYYY-MM-DD szövegként, időzóna-biztos) ---------- */
const bkPad = n => String(n).padStart(2, "0");
const bkIso = d => `${d.getFullYear()}-${bkPad(d.getMonth() + 1)}-${bkPad(d.getDate())}`;
function bkAddDays(s, n) {
    const [y, m, d] = s.split("-").map(Number);
    return bkIso(new Date(y, m - 1, d + n));
}
function bkNights(a, b) {
    const [y1, m1, d1] = a.split("-").map(Number);
    const [y2, m2, d2] = b.split("-").map(Number);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
function bkFormatDate(s) {
    if (!s) return "";
    const [y, m, d] = s.split("-").map(Number);
    const lang = (typeof currentLang !== "undefined" && currentLang) || "hu";
    const locale = { hu: "hu-HU", en: "en-GB", de: "de-DE", hr: "hr-HR" }[lang] || "hu-HU";
    try {
        return new Date(y, m - 1, d).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", weekday: "short" });
    } catch (e) { return s; }
}
const bkMoney = n => (Math.round(n * 100) / 100).toLocaleString("hu-HU") + " €";

/* ---------- Állapot ---------- */
// Ezeket a nevek miatt hagyjuk globálisnak (a script.js nyelvváltója az updateUI()-t hívja)
var bookings = [];          // [{start:"2026-09-09", end:"2026-09-15"}]  (end = távozás napja)
var startDate = null;
var endDate = null;
const bkToday = bkIso(new Date());
let bkView = (() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; })();
let bkLoadState = "loading";   // loading | ok | error
let bkHover = null;
let bkSubmitting = false;

/* Egy éjszaka (az adott napon kezdődő éj) foglalt-e.
   Foglalás: [start, end)  → az "end" napon már nincs éjszaka, tehát
   a távozás napja ÉRKEZÉSI napként szabad. */
function bkNightTaken(s) {
    return bookings.some(b => s >= b.start && s < b.end);
}
function bkRangeFree(a, b) {
    for (let d = a; d < b; d = bkAddDays(d, 1)) if (bkNightTaken(d)) return false;
    return true;
}
function bkCanStart(s) {
    return s >= bkToday && !bkNightTaken(s);
}
function bkCanEnd(s) {
    return !!startDate && !endDate && s > startDate && bkRangeFree(startDate, s);
}

/* ---------- Naptár rajzolás ---------- */
function bkMonthName(m) {
    const lang = (typeof currentLang !== "undefined" && currentLang) || "hu";
    const arr = (typeof translations !== "undefined" && translations[lang] && translations[lang].months)
        || ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
    return arr[m];
}

function bkRenderMonth(year, month, labelID, containerID) {
    const label = document.getElementById(labelID);
    const container = document.getElementById(containerID);
    if (!label || !container) return;
    label.textContent = `${bkMonthName(month)} ${year}`;

    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const previewEnd = (startDate && !endDate && bkHover && bkCanEnd(bkHover)) ? bkHover : null;
    let html = "";
    for (let i = 0; i < firstDay - 1; i++) html += `<div class="day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const s = `${year}-${bkPad(month + 1)}-${bkPad(d)}`;
        const cls = ["day"];
        let title = "";

        if (s < bkToday) {
            cls.push("past", "disabled");
        } else {
            const takenTonight = bkNightTaken(s);
            const takenLastNight = bkNightTaken(bkAddDays(s, -1));
            if (takenTonight && takenLastNight) cls.push("booked");
            else if (takenTonight) { cls.push("half-in"); title = bkT("bk_checkout_only"); }   // ezen a napon érkezik valaki
            else if (takenLastNight) cls.push("half-out");                                   // ezen a napon távozik valaki → érkezhetsz

            const selectingEnd = startDate && !endDate;
            const clickable = bkCanStart(s) || bkCanEnd(s);
            cls.push(clickable ? "free" : "disabled");
            if (selectingEnd && s > startDate && !bkCanEnd(s)) cls.push("out-of-reach");
        }

        if (s === startDate) cls.push("start");
        if (s === endDate) cls.push("end");
        const rangeEnd = endDate || previewEnd;
        if (startDate && rangeEnd && s > startDate && s < rangeEnd) cls.push(endDate ? "inrange" : "preview");
        if (!endDate && previewEnd && s === previewEnd) cls.push("preview-end");
        if (s === bkToday) cls.push("today");

        html += `<div class="${cls.join(" ")}" data-date="${s}"${title ? ` title="${title.replace(/"/g, "&quot;")}"` : ""}>${d}</div>`;
    }
    container.innerHTML = html;
}

function bkShiftMonth(delta) {
    const now = new Date();
    const min = now.getFullYear() * 12 + now.getMonth();
    const max = min + BOOKING_CFG.monthsAhead - 1;
    let v = bkView.y * 12 + bkView.m + delta;
    v = Math.max(min, Math.min(max, v));
    bkView = { y: Math.floor(v / 12), m: v % 12 };
    updateUI();
}

function bkUpdateNavButtons() {
    const now = new Date();
    const min = now.getFullYear() * 12 + now.getMonth();
    const cur = bkView.y * 12 + bkView.m;
    ["prev1", "prev2"].forEach(id => { const b = document.getElementById(id); if (b) b.disabled = cur <= min; });
    ["next1", "next2"].forEach(id => { const b = document.getElementById(id); if (b) b.disabled = cur >= min + BOOKING_CFG.monthsAhead - 2; });
}

function bkOnDayClick(s) {
    if (bkSubmitting) return;
    if (startDate && !endDate) {
        if (s === startDate) { startDate = null; }
        else if (bkCanEnd(s)) {
            if (bkNights(startDate, s) < BOOKING_CFG.minNights) {
                bkSetHint(bkT("bk_err_min", { n: BOOKING_CFG.minNights }), true);
                return;
            }
            endDate = s;
        }
        else if (bkCanStart(s)) { startDate = s; }
    } else if (bkCanStart(s)) {
        startDate = s; endDate = null;
    }
    bkHover = null;
    updateUI();
    if (startDate && endDate) {
        const sec = document.getElementById("bookingFormSection");
        if (sec) setTimeout(() => sec.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
}

function bkAttachCalendarEvents() {
    ["calendar1", "calendar2"].forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.dataset.bkBound) return;
        el.dataset.bkBound = "1";
        el.addEventListener("click", e => {
            const day = e.target.closest(".day.free");
            if (day) bkOnDayClick(day.dataset.date);
        });
        el.addEventListener("mouseover", e => {
            if (!startDate || endDate) return;
            const day = e.target.closest(".day");
            const s = day && day.dataset.date;
            if (s && s !== bkHover) { bkHover = s; bkRenderCalendars(); }
        });
        el.addEventListener("mouseleave", () => {
            if (bkHover) { bkHover = null; bkRenderCalendars(); }
        });
    });
}

function bkRenderCalendars() {
    const second = new Date(bkView.y, bkView.m + 1, 1);
    bkRenderMonth(bkView.y, bkView.m, "monthLabel1", "calendar1");
    bkRenderMonth(second.getFullYear(), second.getMonth(), "monthLabel2", "calendar2");
}

/* ---------- Kiegészítő elemek (jelmagyarázat, összesítő, fizetési mód) ---------- */
function bkInjectExtras() {
    const cal = document.querySelector(".booking-calendar");
    const wrapper = cal && cal.querySelector(".calendar-wrapper");
    if (wrapper && !document.getElementById("bkLegend")) {
        const status = document.createElement("div");
        status.id = "bkStatus";
        status.className = "bk-status";
        status.hidden = true;
        cal.insertBefore(status, cal.querySelector("h2").nextSibling);

        const legend = document.createElement("div");
        legend.id = "bkLegend";
        legend.className = "bk-legend";
        legend.innerHTML =
            `<span><i class="bk-sw bk-sw-free"></i><span data-bk="bk_legend_free"></span></span>` +
            `<span><i class="bk-sw bk-sw-booked"></i><span data-bk="bk_legend_booked"></span></span>` +
            `<span><i class="bk-sw bk-sw-change"></i><span data-bk="bk_legend_change"></span></span>`;
        wrapper.insertAdjacentElement("afterend", legend);

        const hint = document.createElement("p");
        hint.id = "bkHint";
        hint.className = "bk-hint";
        legend.insertAdjacentElement("afterend", hint);
    }

    const form = document.getElementById("bookingForm");
    if (form && !document.getElementById("bkSummary")) {
        const anchor = form.querySelector("#acceptTerms");
        const before = anchor ? anchor.closest("div") : form.querySelector('button[type="submit"]');

        const box = document.createElement("div");
        box.innerHTML = `
          <div class="bk-summary" id="bkSummary">
            <div class="bk-row"><span id="bkNightsLabel"></span><span id="bkNightsAmount"></span></div>
            <div class="bk-row"><span data-bk="bk_cleaning"></span><span id="bkCleaning"></span></div>
            <div class="bk-row bk-total"><span data-bk="bk_total"></span><span id="bkTotal"></span></div>
            <p class="bk-note" data-bk="bk_tax_note"></p>
          </div>
          <fieldset class="bk-pay">
            <legend data-bk="bk_pay_title"></legend>
            <label class="bk-option">
              <input type="radio" name="paymentMethod" value="card" checked>
              <span><strong data-bk="bk_pay_card"></strong>
                <span class="bk-cards" aria-hidden="true">VISA · Mastercard · Apple Pay · Google Pay</span>
                <small data-bk="bk_pay_card_desc"></small></span>
            </label>
            <label class="bk-option">
              <input type="radio" name="paymentMethod" value="transfer">
              <span><strong data-bk="bk_pay_transfer"></strong>
                <small data-bk="bk_pay_transfer_desc"></small></span>
            </label>
          </fieldset>`;
        while (box.firstElementChild) form.insertBefore(box.firstElementChild, before);

        const msg = document.createElement("div");
        msg.id = "bkFormMsg";
        msg.className = "bk-status";
        msg.hidden = true;
        form.appendChild(msg);

        const secure = document.createElement("p");
        secure.className = "bk-secure";
        secure.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 9V6a3 3 0 1 1 6 0v4H9z"/></svg> <span data-bk="bk_secure"></span>`;
        form.appendChild(secure);

        form.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.addEventListener("change", bkUpdateSubmitLabel));
    }
}

function bkApplyTexts() {
    document.querySelectorAll("[data-bk]").forEach(el => { el.textContent = bkT(el.dataset.bk); });
}

function bkSelectedMethod() {
    const r = document.querySelector('input[name="paymentMethod"]:checked');
    return r ? r.value : "transfer";
}

function bkUpdateSubmitLabel() {
    const btn = document.querySelector('#bookingForm button[type="submit"]');
    if (!btn || bkSubmitting) return;
    const key = bkSelectedMethod() === "card" ? "bk_submit_card" : "bk_submit_transfer";
    btn.dataset.lang = key;          // így a nyelvváltó is jó szöveget ír ki
    btn.textContent = bkT(key);
}

function bkUpdateSummary() {
    if (!startDate || !endDate) return;
    const n = bkNights(startDate, endDate);
    const nightsTotal = n * BOOKING_CFG.nightlyPrice;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("bkNightsLabel", bkT("bk_nights", { n, p: BOOKING_CFG.nightlyPrice }));
    set("bkNightsAmount", bkMoney(nightsTotal));
    set("bkCleaning", bkMoney(BOOKING_CFG.cleaningFee));
    set("bkTotal", bkMoney(nightsTotal + BOOKING_CFG.cleaningFee));
}

function bkSetHint(text, warn) {
    const hint = document.getElementById("bkHint");
    if (!hint) return;
    hint.textContent = text;
    hint.classList.toggle("warn", !!warn);
}

function bkShowStatus(id, type, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = !text;
    el.className = "bk-status" + (type ? " " + type : "");
    el.textContent = text || "";
}

/* ---------- Fő frissítő (a nyelvváltó is ezt hívja) ---------- */
function updateUI() {
    if (!document.getElementById("calendar1")) return;
    bkInjectExtras();
    bkApplyTexts();
    bkRenderCalendars();
    bkUpdateNavButtons();

    const none = bkT("booking_none") === "booking_none" ? "—" : bkT("booking_none");
    const st = document.getElementById("startDateText");
    const en = document.getElementById("endDateText");
    if (st) st.textContent = startDate ? bkFormatDate(startDate) : none;
    if (en) en.textContent = endDate ? bkFormatDate(endDate) : none;

    if (bkLoadState === "loading") bkSetHint(bkT("bk_loading"));
    else if (bkLoadState === "error" && !startDate) bkSetHint(bkT("bk_load_error"), true);
    else if (!startDate) bkSetHint(bkT("bk_hint_start"));
    else if (!endDate) bkSetHint(bkT("bk_hint_end"));
    else bkSetHint(bkT("bk_hint_done", { n: bkNights(startDate, endDate) }));

    const formSection = document.getElementById("bookingFormSection");
    if (formSection) {
        if (startDate && endDate) {
            formSection.style.display = "block";
            document.getElementById("checkin").value = startDate;
            document.getElementById("checkout").value = endDate;
            bkUpdateSummary();
        } else {
            formSection.style.display = "none";
        }
    }
    bkUpdateSubmitLabel();
}

/* ---------- Szerver kommunikáció ---------- */
async function bkApiGet(params) {
    const url = BOOKING_API_URL + "?" + new URLSearchParams(params).toString();
    const res = await fetch(url, { method: "GET" });
    return res.json();
}
async function bkApiPost(body) {
    // text/plain törzs → nincs CORS preflight, a Google Apps Script így fogadja
    const res = await fetch(BOOKING_API_URL, { method: "POST", body: JSON.stringify(body) });
    return res.json();
}

async function loadBookings() {
    try {
        const data = await bkApiGet({ action: "bookings", apartment: BOOKING_CFG.apartmentId, t: Date.now() });
        if (!data || !data.ok) throw new Error((data && data.error) || "load failed");
        bookings = (data.bookings || []).filter(b => b && b.start && b.end);
        bkLoadState = "ok";
    } catch (err) {
        console.warn("Foglalások betöltése sikertelen:", err);
        bookings = [];
        bkLoadState = "error";
    }
    // ha a kiválasztás közben foglalttá vált, töröljük
    if (startDate && bkNightTaken(startDate)) { startDate = null; endDate = null; }
    if (startDate && endDate && !bkRangeFree(startDate, endDate)) endDate = null;
    updateUI();
}

async function bkHandleSubmit(e) {
    e.preventDefault();
    if (bkSubmitting) return;
    const form = e.target;

    if (!form.acceptTerms || !form.acceptTerms.checked) {
        alert(bkT("booking_terms_required"));
        return;
    }
    if (!startDate || !endDate) return;

    const method = bkSelectedMethod();
    const btn = form.querySelector('button[type="submit"]');
    bkSubmitting = true;
    btn.disabled = true;
    btn.textContent = bkT("bk_sending");
    bkShowStatus("bkFormMsg", "", "");

    const payload = {
        action: "book",
        apartment: BOOKING_CFG.apartmentId,
        start: startDate,
        end: endDate,
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        address: form.address.value.trim(),
        message: form.message.value.trim(),
        paymentMethod: method,
        lang: (typeof currentLang !== "undefined" && currentLang) || "hu",
        returnUrl: location.origin + location.pathname
    };

    let data = null;
    try {
        data = await bkApiPost(payload);
    } catch (err) {
        console.error(err);
    }

    if (data && data.ok && data.checkoutUrl) {
        btn.textContent = bkT("bk_redirecting");
        window.location.href = data.checkoutUrl;     // Stripe biztonságos fizetőoldal
        return;
    }

    bkSubmitting = false;
    btn.disabled = false;

    if (data && data.ok) {
        bkShowStatus("bkStatus", "ok", bkT("bk_ok_transfer", { id: data.bookingId }));
        startDate = null; endDate = null;
        form.reset();
        await loadBookings();
        document.querySelector(".booking-calendar").scrollIntoView({ behavior: "smooth" });
        return;
    }

    const code = data && data.error;
    if (code === "DATES_TAKEN") {
        bkShowStatus("bkFormMsg", "error", bkT("bk_err_taken"));
        await loadBookings();
    } else if (code === "PAYMENT_NOT_CONFIGURED" || code === "PAYMENT_ERROR") {
        bkShowStatus("bkFormMsg", "error", bkT("bk_err_payment"));
    } else if (code === "MIN_NIGHTS") {
        bkShowStatus("bkFormMsg", "error", bkT("bk_err_min", { n: BOOKING_CFG.minNights }));
    } else {
        bkShowStatus("bkFormMsg", "error", bkT("bk_err_generic"));
    }
    bkUpdateSubmitLabel();
}

/* Visszatérés a Stripe fizetőoldalról */
async function bkHandleReturn() {
    const p = new URLSearchParams(location.search);
    const payment = p.get("payment");
    if (!payment) return;
    history.replaceState(null, "", location.pathname + location.hash);

    if (payment === "success" && p.get("session_id")) {
        bkShowStatus("bkStatus", "info", bkT("bk_pay_checking"));
        try {
            const data = await bkApiGet({ action: "confirm", session_id: p.get("session_id") });
            if (data.ok && data.status === "paid") bkShowStatus("bkStatus", "ok", bkT("bk_ok_paid", { id: data.bookingId }));
            else bkShowStatus("bkStatus", "info", bkT("bk_pay_pending"));
        } catch (e) {
            bkShowStatus("bkStatus", "info", bkT("bk_pay_pending"));
        }
    } else if (payment === "cancelled" && p.get("booking")) {
        try {
            const data = await bkApiGet({ action: "cancel", booking: p.get("booking") });
            if (data.ok && data.status === "paid") bkShowStatus("bkStatus", "ok", bkT("bk_ok_paid", { id: data.bookingId }));
            else bkShowStatus("bkStatus", "warn", bkT("bk_pay_cancelled"));
        } catch (e) {
            bkShowStatus("bkStatus", "warn", bkT("bk_pay_cancelled"));
        }
    }
    const cal = document.querySelector(".booking-calendar");
    if (cal) cal.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Indítás ---------- */
document.addEventListener("DOMContentLoaded", async () => {
    ["prev1", "prev2"].forEach(id => { const b = document.getElementById(id); if (b) b.onclick = () => bkShiftMonth(-1); });
    ["next1", "next2"].forEach(id => { const b = document.getElementById(id); if (b) b.onclick = () => bkShiftMonth(1); });

    bkAttachCalendarEvents();
    updateUI();

    const form = document.getElementById("bookingForm");
    if (form) form.addEventListener("submit", bkHandleSubmit);

    await bkHandleReturn();     // előbb a fizetés eredménye (a lemondás felszabadítja a dátumokat)
    await loadBookings();
});
