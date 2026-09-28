async function startCheckout(items, button, message) {
  button.dataset.defaultLabel ||= button.textContent;
  button.disabled = true;
  button.textContent = "Opening secure checkout...";
  message.textContent = "";
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (!res.ok || !/^https:\/\/checkout\.stripe\.com\//.test(data.url || "")) throw new Error(data.error || "Checkout could not start.");
    location.assign(data.url);
  } catch (error) {
    message.textContent = error.message || "Checkout could not start.";
    button.disabled = false;
    button.textContent = button.dataset.defaultLabel || "Checkout entire bag";
  }
}
