# Bangi

A website for ordering weekly and special Bengali home-cooked meals, paid via Interac e-Transfer.

## Flow

1. **Home** — logo and an animated weekly-menu button.
2. **Weekly Menu** (`/menu`) — one flat-rate plan (price set by the owner) listing this week's dishes. Some dishes offer substitutions (e.g. beef/mutton) via pinboard-style dropdowns; any dish can also offer an "extra portion" add-on at its own price.
3. **Specials** (`/special`) — today/tomorrow one-off meals, priced individually.
4. **Checkout** (`/checkout`) — order summary, customer details, delivery (with a Downtown Montreal / Outside Downtown fee) or pickup, Interac payment instructions, and a payment screenshot upload.
5. **Confirmation** (`/confirmation`) — order confirmed with an animated alpona bloom.
6. **Admin** (`/admin`) — password-protected page where the owner edits the weekly plan, dishes, substitutions, extra-portion prices, and specials. Changes go live for customers immediately.

## Stack

React + TypeScript + Vite, Tailwind CSS, Framer Motion, React Router, Firebase (Firestore + Auth) for the live menu and admin login.

Cart and order state are still kept in `localStorage` for now (no order backend yet) — the payment screenshot is stored as a data URL for the owner's reference on the confirmation page. A future iteration would send orders to Firestore too, so the owner actually receives them instead of them only living in the customer's browser.

## Develop

```bash
npm install
npm run dev
```

The site works without Firebase configured — it just falls back to the sample menu baked into `src/data/menu.ts`, and `/admin` shows a "not set up yet" message instead of a login form. To make the menu live and editable, follow the setup below.

## Owner admin setup (one-time)

This connects the site to a free Firebase project so the `/admin` page works and the menu is editable without touching code.

### 1. Create a Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with a Google account (create one if needed — this can be the owner's own account).
2. Click **Add project**, name it (e.g. "bangi"), and finish the wizard (Google Analytics is optional, skip it).

### 2. Turn on Firestore (the database)
1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**, choose a location close to Montreal (e.g. `us-east4` or `northamerica-northeast1`), and start in **production mode**.
3. Once created, go to the **Rules** tab, delete what's there, and paste in the contents of `firestore.rules` from this repo. Click **Publish**.

### 3. Turn on Email/Password sign-in (the owner's login)
1. In the sidebar, click **Build → Authentication**, click **Get started**.
2. Under **Sign-in method**, enable **Email/Password**.
3. Go to the **Users** tab → **Add user**. Enter the owner's email and a password — this is exactly what they'll type into `/admin` to log in. (Add more than one user here later if more than one person should have access.)

### 4. Get the web app config
1. Click the gear icon (Project settings) → scroll to **Your apps** → click the `</>` (web) icon to register a new web app (any nickname is fine, no hosting needed).
2. It'll show a `firebaseConfig` object with values like `apiKey`, `authDomain`, etc. Keep this page open.

### 5. Add the config to the project
1. In the project folder, copy `.env.example` to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in each value from the `firebaseConfig` object you just saw (matching names, e.g. `apiKey` → `VITE_FIREBASE_API_KEY`).
3. Restart `npm run dev` if it was already running.

`.env.local` is git-ignored — it never gets committed or pushed, so these keys stay private to whoever runs the project locally. If the site gets deployed to a host like Vercel or Netlify later, the same variables get added there under the host's "Environment Variables" settings instead.

### 6. Log in and load the starter menu
1. Visit `/admin` on the site and sign in with the email/password you created in step 3.
2. The first time, click **Load Sample Menu** to pre-fill Firestore with the example dishes — then edit or delete anything from there. Add dishes, set the plan price, add substitutions, add specials, all from that page.

That's it — from here on, the owner only ever needs `/admin`, no code or redeploys required to change what customers see.
