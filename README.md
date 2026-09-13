# Bangi

A website for ordering weekly and special Bengali home-cooked meals, paid via Interac e-Transfer.

## Flow

1. **Home** — logo, animated weekly-menu button, and (when posted) a special-meal teaser.
2. **Weekly Menu** (`/menu`) — this week's dishes, with pinboard-style dropdowns for substitutions (protein, spice level, sides, etc).
3. **Specials** (`/special`) — today/tomorrow one-off meals, same ordering pattern.
4. **Checkout** (`/checkout`) — order summary, customer details, delivery/pickup choice, Interac payment instructions, and a payment screenshot upload.
5. **Confirmation** (`/confirmation`) — order confirmed with an animated alpona bloom.

## Stack

React + TypeScript + Vite, Tailwind CSS, Framer Motion, React Router.

Cart and order state are currently kept in `localStorage` (no backend yet) — the payment screenshot is stored as a data URL for the owners' reference. A future iteration would wire this up to a real backend/database so orders actually reach the kitchen instead of just living in the customer's browser.

## Develop

```bash
npm install
npm run dev
```
