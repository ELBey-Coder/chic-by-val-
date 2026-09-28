# Chic by Val Storefront

A responsive boutique e-commerce website built with plain HTML, CSS, and JavaScript. Supabase supplies the secure owner login, product database, and image storage. A Supabase Edge Function creates a single hosted Stripe Checkout Session without exposing secret keys.

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

### 3. Connect Stripe Checkout (server-side)

The bag now creates **one Stripe Checkout Session** for all items. It reads active product prices from Supabase on the server, checks the selected sizes and colors, collects a US shipping address and phone number, and lists each selected variant in Stripe's order line items. The browser never receives a Stripe secret key.

1. In Stripe **test mode**, review the proposed **$12.95 flat Standard US shipping per order**. This is a store charge based on USPS starting prices, not a carrier quote or a guarantee that it covers every parcel. Adjust `1295` cents in `supabase/functions/create-checkout/index.ts` and the displayed amount in `js/cart.js` together if Val wants another rate. Stripe may charge processing fees on completed live payments.
2. Get the Stripe **test secret key** (`sk_test_...`) from Stripe Developers > API keys. Never paste this key into the website, GitHub, or public chat.
3. In Supabase Dashboard > Edge Functions > Secrets, set `STRIPE_SECRET_KEY`. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never put these keys in public files.
4. Deploy `supabase/functions/create-checkout/index.ts` as a Supabase Edge Function named `create-checkout` with JWT verification **enabled**. The storefront sends its public Supabase anon JWT in the Authorization header. The repository's `supabase/config.toml` sets `verify_jwt = true` for CLI deployment.
5. Test an actual product with one size/color, and a bag with two products in Stripe test mode. Confirm that the Checkout Session lists both lines and the selected variants, requires a shipping address, and applies the intended shipping charge. Use Stripe's test card instructions, never a real card in test mode.
6. Only after checking fulfillment and shipping, replace the secret with a **live** secret key, then deploy the site. Check the account's payment and shipping settings in Stripe Dashboard separately; this repository cannot read those account settings.

The old Stripe Payment Link field is no longer on the owner form. Existing product links remain in the database but are not used by the new checkout. The Stripe Dashboard remains the order record; do not fulfill orders solely from the site's success message. This version does not reserve inventory or automatically synchronize fulfillment status.

## Owner workflow

1. Sign in at admin/login.html.
2. Select Add product.
3. Upload a JPG, PNG, or WebP image under 5 MB.
4. Enter name, category, price, sizes, material, description, and colors.
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
- Confirm the final shipping and exchange policies with Val.
- Test admin sign-in, image upload, editing, hiding, deletion, and the combined Stripe checkout.
- Add the live domain to Supabase Authentication > URL Configuration > Redirect URLs.
- Keep Val's password and Stripe login private.

## September 2026 changes and payment limitations

The supplied logo is installed. The menu lists Women’s clothing, Jewelry, Underwear, and Purses; Men’s and Children’s clothing are marked coming soon. Product size and color values are comma-separated in the owner form. Run the updated `supabase/schema.sql` in SQL Editor before using that form, so the `colors` column exists. Existing products keep their current categories until Val edits them.

Buy Now and the bag now use one server-created Stripe Checkout Session. The selected size and color are part of each Stripe line item. The Edge Function must be deployed and configured before the checkout buttons work.

The new Checkout Session requires a US shipping address and uses the configured shipping rate. Verify the return policy with Val and test checkout before live payment. Review existing Payment Links separately if customers can still reach them through old URLs.
