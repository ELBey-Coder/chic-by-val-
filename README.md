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

### 2. Create Val's owner account

1. In Supabase, open Authentication > Users.
2. Click Add user > Create new user.
3. Enter achuval@yahoo.com and a strong temporary password.
4. Check Auto Confirm User, then create the account.
5. Give the password to Val privately. She can sign in at /admin/login.html.

### Password recovery

The owner login now includes **Forgot your password?**. Supabase emails a recovery link that opens /admin/new-password.html, where Val can choose a new password. After deployment, add both the Vercel and Hostinger versions of that page to Supabase under Authentication > URL Configuration > Redirect URLs.

The included security rules let visitors read active products while only a signed-in user can create, edit, hide, or delete products.

### 3. Connect Stripe

1. Create or open the Stripe account.
2. In Stripe, open Payment Links and create a link for each item.
3. Val pastes that link into the Stripe Payment Link field while adding or editing the matching product.
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

- Replace demo product content by connecting Supabase and adding Val's real products.
- Confirm the final shipping, pickup, and exchange policies with Val.
- Test admin sign-in, image upload, editing, hiding, deletion, and every Stripe link.
- Add the live domain to Supabase Authentication > URL Configuration > Redirect URLs.
- Keep Val's password and Stripe login private.

## September 2026 changes and payment limitations

The supplied logo is installed. The menu lists Women’s clothing, Jewelry, Underwear, and Purses; Men’s and Children’s clothing are marked coming soon. Product size and color values are comma-separated in the owner form. Run the updated `supabase/schema.sql` in SQL Editor before using that form, so the `colors` column exists. Existing products keep their current categories until Val edits them.

Buy Now opens a product’s existing Stripe Payment Link only when no size or color choice is needed. The site does not transmit variants to Stripe, so products with choices require Val to confirm them. A mixed bag is not a single checkout; each eligible item has its own link. A true combined-cart checkout requires a server endpoint, Stripe secret key stored on the server, verified prices, and an order fulfillment flow. Do not put the Stripe secret key in public JavaScript.

Update any Stripe Payment Links to require a shipping address and disable local pickup in the Stripe dashboard. Verify the return policy with Val. Test checkout in Stripe test mode before live payment.
