# Chic by Val Storefront

A responsive boutique e-commerce website built with plain HTML, CSS, and JavaScript. Supabase supplies the secure owner login, product database, and image storage. Stripe Payment Links supply hosted checkout without exposing secret keys.

## Pages

- Home, Shop, Product, Shopping Bag
- Our Story, FAQ, Contact
- Private Owner Login, Product Dashboard, Add/Edit Product
- Built-in rule-based Style Assistant on customer pages (no AI API or fee)

## One-time launch setup

### 1. Connect Supabase

1. Create a free project at https://supabase.com/dashboard.
2. Open SQL Editor, paste all of supabase/schema.sql, then click Run.
3. Open Project Settings > API.
4. Copy the Project URL and anon/public key into js/supabase-config.js.
5. Never put the service-role key in this website.

### 2. Create Valerie's owner account

1. In Supabase, open Authentication > Users.
2. Click Add user > Create new user.
3. Enter achuval@yahoo.com and a strong temporary password.
4. Check Auto Confirm User, then create the account.
5. Give the password to Valerie privately. She can sign in at /admin/login.html.

The included security rules let visitors read active products while only a signed-in user can create, edit, hide, or delete products.

### 3. Connect Stripe

1. Create or open the Stripe account.
2. In Stripe, open Payment Links and create a link for each item.
3. Valerie pastes that link into the Stripe Payment Link field while adding or editing the matching product.
4. Test each link in Stripe test mode before switching it live.

This basic version sends each item to its own secure Stripe checkout. A future version can add a server-side combined-cart checkout and inventory synchronization.

## Owner workflow

1. Sign in at admin/login.html.
2. Select Add product.
3. Upload a JPG, PNG, or WebP image under 5 MB.
4. Enter name, category, price, sizes, material, description, and Stripe link.
5. Choose whether it is visible and featured, then publish.
6. Use Edit or Delete on the dashboard whenever details change.

## Run in VS Code

This is a static site, not an npm project. Do not use npm run dev.

1. Open this exact project folder in VS Code.
2. Install the Live Server extension.
3. Right-click index.html and choose Open with Live Server.

Opening the folder itself in VS Code avoids the file-does-not-reside-within-a-trusted-folder error. If asked, choose Trust the authors of all files in this folder.

## Before launch

- Replace demo product content by connecting Supabase and adding Valerie's real products.
- Confirm the final shipping, pickup, and exchange policies with Valerie.
- Test admin sign-in, image upload, editing, hiding, deletion, and every Stripe link.
- Add the live domain to Supabase Authentication > URL Configuration > Redirect URLs.
- Keep Valerie's password and Stripe login private.
