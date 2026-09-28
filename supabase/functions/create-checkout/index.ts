// Deploy with JWT verification enabled; the storefront sends its public anon JWT.
// Secrets: STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY. Flat US shipping: $12.95/order.
const jsonHeaders = { "Content-Type": "application/json" };
const allowedOrigins = new Set([
  "https://chicbyval.com", "https://www.chicbyval.com", "https://chic-by-val.vercel.app",
  "https://chic-by-val-git-chic-val-refresh-2026-09-27-diverseconsulting.vercel.app",
]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function response(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, "Access-Control-Allow-Origin": origin, Vary: "Origin" } });
}
function choices(value: unknown): string[] {
  return String(value || "").split(",").map((x) => x.trim()).filter(Boolean);
}
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  if (!allowedOrigins.has(origin)) return new Response("Origin not allowed", { status: 403 });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, apikey, authorization", Vary: "Origin" } });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405, origin);
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const dbUrl = Deno.env.get("SUPABASE_URL");
  const dbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!stripeKey || !dbUrl || !dbKey) return response({ error: "Checkout has not been configured." }, 503, origin);
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length < 1 || items.length > 20) return response({ error: "Bag must contain 1 to 20 lines." }, 400, origin);
    const parsed = items.map((x) => ({ id: String(x.id || ""), qty: Number(x.qty), size: String(x.size || ""), color: String(x.color || "") }));
    if (parsed.some((x) => !uuid.test(x.id) || !Number.isInteger(x.qty) || x.qty < 1 || x.qty > 10 || x.size.length > 60 || x.color.length > 60)) return response({ error: "Invalid bag item." }, 400, origin);
    const ids = [...new Set(parsed.map((x) => x.id))];
    const params = new URLSearchParams({ select: "id,name,price,sizes,colors,active", active: "eq.true", id: `in.(${ids.join(",")})` });
    const db = await fetch(`${dbUrl}/rest/v1/products?${params}`, { headers: { apikey: dbKey, Authorization: `Bearer ${dbKey}` } });
    if (!db.ok) throw new Error("Catalog unavailable");
    const products = new Map((await db.json()).map((p: Record<string, unknown>) => [p.id, p]));
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", `${origin}/cart.html?checkout=success`);
    form.set("cancel_url", `${origin}/cart.html?checkout=cancel`);
    form.set("shipping_address_collection[allowed_countries][0]", "US");
    form.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    form.set("shipping_options[0][shipping_rate_data][display_name]", "Standard US shipping");
    form.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", "1295");
    form.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
    form.set("phone_number_collection[enabled]", "true");
    form.set("metadata[source]", "chicbyval-web-bag");
    let total = 0;
    for (const [i, item] of parsed.entries()) {
      const product = products.get(item.id) as Record<string, unknown> | undefined;
      if (!product) return response({ error: "An item is no longer available. Refresh your bag." }, 409, origin);
      const sizes = choices(product.sizes), colors = choices(product.colors);
      if ((sizes.length && !sizes.includes(item.size)) || (!sizes.length && item.size) || (colors.length && !colors.includes(item.color)) || (!colors.length && item.color)) return response({ error: `Select a valid size and color for ${product.name}.` }, 400, origin);
      const cents = Math.round(Number(product.price) * 100);
      if (!Number.isSafeInteger(cents) || cents < 50 || cents > 1000000) return response({ error: "An item has an invalid price." }, 409, origin);
      total += cents * item.qty;
      const label = `${product.name}${item.size ? ` | Size ${item.size}` : ""}${item.color ? ` | Color ${item.color}` : ""}`;
      const prefix = `line_items[${i}]`;
      form.set(`${prefix}[quantity]`, String(item.qty));
      form.set(`${prefix}[price_data][currency]`, "usd");
      form.set(`${prefix}[price_data][unit_amount]`, String(cents));
      form.set(`${prefix}[price_data][product_data][name]`, String(label).slice(0, 250));
      form.set(`${prefix}[price_data][product_data][metadata][catalog_id]`, item.id);
    }
    if (total > 2000000) return response({ error: "Bag total is too large." }, 400, origin);
    const stripe = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    const session = await stripe.json();
    if (!stripe.ok || !session.url) { console.error("Stripe checkout error", session.error?.type, session.error?.code, session.error?.message); return response({ error: "Checkout could not start. Please try again." }, 502, origin); }
    return response({ url: session.url }, 200, origin);
  } catch (error) { console.error("Checkout error", error); return response({ error: "Checkout could not start. Please try again." }, 500, origin); }
});
