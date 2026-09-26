# Bangi

A website for ordering weekly and special Bengali home-cooked meals, paid via Interac e-Transfer.

## Flow

1. **Home** — logo and an animated weekly-menu button.
2. **Weekly Menu** (`/menu`) — one flat-rate plan (price set by the owner) listing this week's dishes. Some dishes offer substitutions (e.g. beef/mutton) via pinboard-style dropdowns; any dish can also offer an "extra portion" add-on at its own price.
3. **Specials** (`/special`) — today/tomorrow one-off meals, priced individually.
4. **Checkout** (`/checkout`) — order summary, customer details, delivery (with a Downtown Montreal / Outside Downtown fee) or pickup, Interac payment instructions, and a payment screenshot upload. On confirm, the order is saved to Firestore (so the owner receives it) and a confirmation email is sent to the customer.
5. **Confirmation** (`/confirmation`) — order confirmed with an animated alpona bloom.
6. **Admin** (`/admin`) — password-protected page where the owner sees incoming orders (customer info, what they ordered, payment screenshot, a way to mark each as confirmed), edits the weekly plan, dishes, substitutions, extra-portion prices, and specials, and edits business settings (Interac email, pickup address, delivery fees). Changes go live for customers immediately.

## Stack

React + TypeScript + Vite, Tailwind CSS, Framer Motion, React Router, Firebase (Firestore + Auth) for the live menu, orders, and admin login, EmailJS for the customer confirmation email.

Orders are saved to Firestore's `orders` collection: a customer can create their own order but can never read anyone else's (name, phone, address, order history) — only the signed-in owner account can see the order list, via `/admin`. The payment screenshot is compressed client-side before saving so it fits comfortably inside Firestore's per-document size limit.

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

### 7. (Optional) Set up the confirmation email

Skip this and everything above still works fine — orders still save and show up in `/admin`, customers just won't get an automatic email. This step adds that email, using [EmailJS](https://www.emailjs.com) (free for up to 200 emails/month, no card required).

1. Go to [emailjs.com](https://www.emailjs.com) and sign up.
2. **Email Services** (left sidebar) → **Add New Service** → pick **Gmail** (simplest) → connect the Google account you want the emails to send *from* (can be a personal Gmail, or a dedicated one for the business).
3. **Email Templates** → **Create New Template**. This is the email itself:
   - Find the **"To email"** field in the template's settings (not the body) and set it to `{{to_email}}` — this is what actually routes the email to the customer, easy to miss.
   - Subject, e.g.: `Your Bangi order is confirmed!`
   - Body — write it however you like, using these placeholders anywhere in the text:
     `{{to_name}}`, `{{order_id}}`, `{{order_summary}}`, `{{total}}`, `{{fulfillment_summary}}`
   - Save the template.
4. Collect three values:
   - **Service ID** — shown next to the Gmail service you created (Email Services tab)
   - **Template ID** — shown next to the template you just made (Email Templates tab)
   - **Public Key** — **Account** (top right) → **General** tab
5. Add all three to `.env.local`:
   ```
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```
6. Restart `npm run dev`. Place a real test order to confirm the email arrives.

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
