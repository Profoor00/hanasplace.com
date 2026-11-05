# Booking calendar + card payment: setup guide

## What changed

| File | Change |
|---|---|
| `booking.js` (new) | One shared calendar for all 3 apartments. The check-out day is free for the next guest's check-in (a 9–15 Sept booking leaves 15 Sept open for a new arrival). Also shows price summary and the card / bank-transfer choice |
| `booking.css` (new) | Calendar half-day colours (arrival/departure days), legend, payment boxes |
| `google-apps-script.gs` (new) | Server part. Paste it into Google Apps Script (step 2). Stores bookings in a Google Sheet, checks availability, calculates the price, creates the Stripe payment and sends emails |
| `apartman1/2/3.html` | Old inline booking script removed (incl. the **public JSONBin master key**). Now loads `booking.js`. "Payment" text updated in 4 languages |
| `script.js` | 1-line fix: the language buttons now really switch `currentLang`, so the calendar changes language too |
| `index.html` | 1-line fix: a script error that stopped the home page's extra translations from loading |

How card payment stays safe:
- Guests type their card details on **Stripe's own page**, never on your site. You never see or store card data.
- The secret Stripe key is kept only in Google Apps Script, never in the website code.
- The **server** calculates the price, so nobody can change the amount in their browser.
- A payment counts as done only after the server checks it with Stripe directly.
- While a guest pays, their dates are held for 35 minutes. If they cancel or leave, the dates open up again on their own.

---

## 1. Create a Stripe account (≈10 min)

1. Sign up at https://dashboard.stripe.com/register (country: Hungary or Croatia).
2. Stay in **Test mode** at first (toggle at the top right).
3. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_...`).

## 2. Set up the server part (Google Apps Script)

1. Open https://sheets.new and name the sheet *Apartman foglalások*.
2. Go to **Extensions → Apps Script**. Delete the sample code and paste all of `google-apps-script.gs`. Save.
3. Go to **Project Settings (⚙) → Script properties → Add**:

   | Property | Value |
   |---|---|
   | `STRIPE_SECRET_KEY` | `sk_test_...` |
   | `OWNER_EMAIL` | your email (booking notifications go here) |
   | `BANK_DETAILS` | e.g. `Name: Pataki Levente` + new line + `IBAN: HU.. ....` + new line + `Bank: ...` |
   | `SITE_URL` | your website address, e.g. `https://www.yourdomain.hu` (guests can only be sent back to this site) |
   | `OWNER_NAME` | *(optional)* name shown as the guest email sender |
   | `CALENDAR_ID` | *(optional)* Google Calendar ID, if bookings should also appear there (Calendar → Settings → *Integrate calendar*) |

4. In the editor, select **`setup`** at the top and click **Run**. Allow the permissions it asks for (sheet, email, external request to Stripe, calendar). The log should end with *"Stripe kapcsolat OK (TESZT mód)"*. This also starts a 10-minute check that confirms payments even if a guest closes the browser right after paying.
5. Go to **Deploy → New deployment → type: Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy** and copy the **Web app URL**.
6. In `booking.js`, line 21, replace `BOOKING_API_URL` with this URL.

> Note: `BOOKING_API_URL` currently holds the URL of your **old** Apps Script. The old script doesn't have the new functions, so either paste the new code into that same project and deploy a new version (the URL stays the same), or use the new URL.
> Later code changes: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.

## 3. Test

Upload the site (it must run on `https://`, not opened from your computer as a file). Then:

1. Pick dates and choose **Online card payment**.
2. On the Stripe page use card `4242 4242 4242 4242`, any future expiry date and any CVC.
3. You come back to the apartment page with a green "Payment successful" message. The sheet shows **FIZETVE** and both emails arrive.
4. Pick the same apartment again: the departure day is now half red and **can be chosen as the next arrival day**.
5. Also try **Bank transfer**, and try pressing "← Back" on the Stripe page (the dates should open up again).

## 4. Go live

1. In Stripe, **Activate account** (company/personal details, bank account for payouts).
2. Switch to Live mode, copy the `sk_live_...` key, and replace `STRIPE_SECRET_KEY` in the Script properties.
3. Done. Nothing needs to change on the website.

Refunds: Stripe Dashboard → Payments → the payment → **Refund**, then set the sheet row to `LEMONDVA`.

## Managing bookings in the Google Sheet

The **Státusz** (status) column controls the calendar:

| Status | Blocks the calendar? | Meaning |
|---|---|---|
| `FIZETVE` | yes | paid by card |
| `ÁTUTALÁSRA VÁR` | yes | bank transfer requested, waiting for money |
| `VISSZAIGAZOLVA` | yes | set this by hand when a transfer arrives |
| `ZÁRVA` | yes | manual block (Booking.com, own use, maintenance) |
| `FIZETÉSRE VÁR` | 35 min | guest is on the Stripe page right now |
| `LEMONDVA` / `LEJÁRT` | no | cancelled / expired, dates are free |

**Blocking dates by hand** (e.g. a Booking.com reservation): add a row with only *Apartman* = `Apartman 2`, *Érkezés* = `2027-07-14`, *Távozás* = `2027-07-20`, *Státusz* = `ZÁRVA`. The departure day stays free for a new arrival.

Prices are set in two places: `APARTMENTS` at the top of the Apps Script (this is what guests pay) and `BOOKING_CONFIG` in each apartment HTML (only the preview shown on the page). Change both.

## ⚠️ Do these too

- **Revoke the JSONBin key.** The master key was visible in `apartman2.html` and `apartman3.html`, so anyone could edit or delete those bookings. Log in to jsonbin.io → API Keys → delete / regenerate. If there are future bookings in those bins, add them to the sheet first (status `VISSZAIGAZOLVA`).
- **Update the Terms (ÁSZF)** with card payment, cancellation and refund rules.
- The online price is nights + cleaning. The **tourist tax and dog fee** are still paid on site.
- Booking emails are now sent from your Google account (limit about 100 per day on free Gmail). EmailJS is still used by the contact form.
