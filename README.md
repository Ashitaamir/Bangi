# Bangi — website to automate ordering process

Replaces a slow Instagram DM + manual Interac e-Transfer ordering process with a full self-serve ordering site for a Bengali cloud-kitchen business — customers order and pay online, the owner runs the whole menu and sees every order from one dashboard, with no code changes needed day-to-day.

**Live demo:** [bangi2026.web.app](https://bangi2026.web.app)

## Screenshots

<!-- TODO: add screenshots to a screenshots/ folder and reference them here, e.g.
![Home page](screenshots/home.png)
![Weekly menu](screenshots/menu.png)
![Admin dashboard](screenshots/admin.png)
-->

## Features

- Weekly menu ordering with pinboard-style dish substitutions and extra-portion add-ons
- One-off daily/weekly specials, priced individually
- Checkout flow with delivery-zone pricing or pickup, Interac e-Transfer payment instructions, and payment-screenshot upload
- Password-protected admin dashboard: live menu and specials editing, order tracking grouped by week, order status, and business settings (pickup address, delivery fees, payment email) — all editable without touching code
- Smooth, Bengali-themed animations throughout

## Tech stack

React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router — Firebase (Firestore + Authentication) for the live menu, orders, and admin login, Firebase Hosting for deployment.

## Architecture & notable decisions

- **No custom backend.** Firestore security rules do the access control instead of API code: a customer can create their own order but can never read anyone else's name, phone, address, or order history — only the signed-in owner account can list orders. A rule function validates the shape and size of every order on write, so malformed or oversized submissions are rejected before they ever reach the database.
- **Client-side image compression** for payment-proof screenshots (plain HTML5 Canvas, no dependency) before they're written to Firestore, to stay under Firestore's 1&nbsp;MB per-document limit without needing separate file storage.
- **Graceful degradation when unconfigured.** Every Firestore-backed hook falls back to static sample data if Firebase isn't set up, so the app runs — and is reviewable — with zero external setup.

## Getting started

```bash
git clone https://github.com/Ashitaamir/Bangi.git
cd Bangi
npm install
npm run dev
```

This runs the site against built-in sample data, no setup required. To connect a real Firebase project for live menu editing, real orders, and admin login, see [Owner admin setup](#owner-admin-setup-one-time) below.

## How it works

1. **Home** — logo and an animated weekly-menu button.
2. **Weekly Menu** (`/menu`) — one flat-rate plan (price set by the owner) listing this week's dishes. Some dishes offer substitutions (e.g. beef/mutton) via pinboard-style dropdowns; any dish can also offer an "extra portion" add-on at its own price.
3. **Specials** (`/special`) — today/tomorrow one-off meals, priced individually.
4. **Checkout** (`/checkout`) — order summary, customer details, delivery (with a Downtown Montreal / Outside Downtown fee) or pickup, Interac payment instructions, and a payment screenshot upload. On confirm, the order is saved to Firestore so the owner receives it.
5. **Confirmation** (`/confirmation`) — order confirmed with an animated alpona bloom.
6. **Admin** (`/admin`) — password-protected page where the owner sees incoming orders (customer info, what they ordered, payment screenshot, a way to mark each as confirmed), edits the weekly plan, dishes, substitutions, extra-portion prices, and specials, and edits business settings (Interac email, pickup address, delivery fees). Changes go live for customers immediately.

Orders are saved to Firestore's `orders` collection: a customer can create their own order but can never read anyone else's (name, phone, address, order history) — only the signed-in owner account can see the order list, via `/admin`. The payment screenshot is compressed client-side before saving so it fits comfortably inside Firestore's per-document size limit.

## Owner admin setup (one-time)

This connects the site to a free Firebase project so the `/admin` page works and the menu is editable without touching code.

### 1. Create a Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with a Google account (create one if needed — this can be the owner's own account).
2. Click **Add project**, name it (e.g. "bangi"), and finish the wizard (Google Analytics is optional, skip it).

### 2. Turn on Firestore (the database)
1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**, choose a location close to Montreal (e.g. `us-east4` or `northamerica-northeast1`), and start in **production mode**.
3. Once created, go to the **Rules** tab, delete what's there, and paste in the contents of `firestore.rules` from this repo. Click **Publish**.

   **Already did this before and just pulled new code?** The rules file has changed since (most recently: a `settings` section for the editable business settings) — go back to the Rules tab, replace the whole thing with the current contents of `firestore.rules`, and Publish again. Takes a minute and is safe to redo any time the file changes.

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

`.env.local` is git-ignored — it never gets committed or pushed, so these keys stay private to whoever runs the project locally.

### 6. Log in and load the starter menu
1. Visit `/admin` on the site and sign in with the email/password you created in step 3.
2. The first time, click **Load Sample Menu** to pre-fill Firestore with the example dishes — then edit or delete anything from there. Add dishes, set the plan price, add substitutions, add specials, all from that page.

That's it for the menu and admin login — from here on, the owner only ever needs `/admin`, no code or redeploys required to change what customers see.

## Deploying (going live)

The site deploys to **Firebase Hosting** — the same Firebase project already used for the database and login, so there's no new account to create. This repo already includes `firebase.json` and `.firebaserc` pointing at the project, so it's just a few commands.

### One-time setup
1. Install the Firebase CLI (needs Node, which is already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Log in (opens a browser — sign in with the same Google account used for the Firebase project):
   ```bash
   firebase login
   ```

### Every time you want to publish changes
```bash
npm run deploy
```
This builds the site (`npm run build`, using whatever is in your local `.env.local`) and uploads it to Firebase Hosting. It prints a **Hosting URL** when done — something like `https://bangi2026.web.app` — that's the live, public link. Share that link with real customers.

A few things worth knowing:
- The live site bakes in whatever is in `.env.local` **on the machine that runs `npm run deploy`** at build time — so deploy from the same machine that's had the setup above done on it.
- Deploying does **not** touch the menu, orders, or admin login — those all live in Firestore/Auth, completely separate from the website files. Redeploying only updates the code (pages, styling, features).
- To publish a change, the same two steps always apply: `git pull` the latest code, then `npm run deploy`.
- The link stays the same forever once you've deployed once — no need to reshare it after future deploys.
