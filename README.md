# Chic by Val — E-Commerce Site

A plain HTML/CSS/JavaScript clothing store with a self-serve admin dashboard,
Stripe checkout, and a built-in (no-API) chat assistant.

## What's included

| Page | Purpose |
|---|---|
| `index.html` | Homepage — hero + featured new arrivals |
| `shop.html` | Full product grid with category filter |
| `product.html?id=...` | Single product detail page |
| `cart.html` | Shopping bag + Stripe checkout links |
| `about.html`, `contact.html` | Store info + contact form |
| `admin/login.html` | Admin sign-in |
| `admin/dashboard.html` | Product list — edit or delete any product |
| `admin/add-edit-product.html` | Add a new product, or edit one (`?id=...`) |

Every page includes the chat assistant (bottom-right bubble). It's rule-based
JavaScript — see `js/chatbot.js` — no external API, no monthly cost, works
offline once the page is loaded.

## Why Firebase is in here

Valerine needs to upload products from her own computer and have every
shopper, on any device, see them immediately. Plain JavaScript alone can't
do that — a file saved in one browser (`localStorage`) never reaches anyone
else's browser. Firebase is Google's free backend service: it stores the
product data (Firestore), stores the photos (Storage), and handles the
admin login (Authentication) — all called directly from these HTML/JS files.
There is no server to set up or maintain, and the free tier covers a
boutique store's traffic comfortably.

**Setup is fully documented inside `js/firebase-config.js`.** In short:
1. Create a free project at https://console.firebase.google.com
2. Register a "Web app" and copy the config values into `js/firebase-config.js`
3. Enable Email/Password Authentication, create Valerine's admin login
4. Enable Firestore Database and Storage
5. Paste in the security rules included in that file's comments

## Setting up Stripe checkout

This site uses **Stripe Payment Links** — no backend code required:
1. Create a free Stripe account at https://stripe.com
2. For each product, go to Stripe Dashboard → Payment Links → create one
   matching that product's price
3. Paste the generated link into the "Stripe payment link" field when adding
   or editing that product in the admin dashboard
4. Shoppers click "Buy now" / "Buy this item" and pay directly on Stripe's
   secure hosted page — card data never touches this site

This keeps things simple and secure for launch. Down the road, a small
serverless function (e.g. a single Firebase Cloud Function) can combine an
entire cart into one Stripe Checkout session if Valerine wants true
multi-item checkout — flagged here as a natural v2 upgrade, not needed to
launch.

## Deploying the site

**Recommended: Vercel.** This is a plain static site (no build step), so
Vercel serves it as-is with zero configuration:

- **From the terminal:** `cd` into this folder and run `npx vercel`, then
  follow the prompts. Leave the build command and output directory blank —
  there's nothing to build.
- **From GitHub:** push this folder to a repo, then in the Vercel dashboard
  click "Add New" → "Project" → import that repo. Framework preset: "Other".
  Build command / output directory: leave blank.

Either way you get a live URL immediately (e.g. `your-project.vercel.app`),
and a custom domain can be added afterward under the project's Domains
settings.

Firebase and Stripe work exactly the same on Vercel as anywhere else —
they're called directly from the browser (via `firebase-config.js` and the
Stripe payment links), so hosting choice doesn't affect them at all.

Other free options that work just as well if preferred: **Firebase Hosting**
(`npm install -g firebase-tools`, then `firebase login`, `firebase init
hosting`, `firebase deploy`) or **GitHub Pages** (push to a repo, enable
Pages in repo settings, point at the root folder).

## Editing products

Valerine never needs to touch code. From `admin/dashboard.html` she can:
- **Add** a product — photo, name, category, price, size, material,
  description, and Stripe link
- **Edit** any product — click "Edit" in the table, change any field, save
- **Delete** a product — click "Delete" (asks for confirmation first)

Changes appear on the live site within a second or two, for every visitor.

## Folder structure

```
ecommerce-site/
├── index.html, shop.html, product.html, cart.html, about.html, contact.html
├── css/
│   ├── style.css      — site-wide design system
│   ├── chatbot.css     — chat widget styling
│   └── admin.css       — admin dashboard styling
├── js/
│   ├── firebase-config.js  — Firebase setup (paste your keys here)
│   ├── products.js         — shared product fetch/render logic
│   ├── cart.js             — shopping bag logic (localStorage)
│   ├── chatbot.js          — rule-based chat assistant
│   └── main.js             — nav toggle, small helpers
└── admin/
    ├── login.html
    ├── dashboard.html
    ├── add-edit-product.html
    └── js/
        ├── admin-auth.js       — login guard for admin pages
        └── admin-products.js   — add/edit/delete logic
```
