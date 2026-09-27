const CART_KEY="chicByValCart";
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return[]}}
function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const count=getCart().reduce((n,x)=>n+(x.qty||1),0);document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count)}
function addToCart(id,qty=1,size="",color=""){const cart=getCart(),line=cart.find(x=>x.id===id&&x.size===size&&x.color===color);if(line)line.qty+=qty;else cart.push({id,qty,size,color});saveCart(cart);if(typeof showToast==="function")showToast("Added to your bag")}
function removeFromCart(id,size="",color=""){saveCart(getCart().filter(x=>!(x.id===id&&(x.size||"")===size&&(x.color||"")===color)));renderCartPage()}
async function renderCartPage(){
 const lines=document.getElementById("cart-lines"),actions=document.getElementById("checkout-actions");if(!lines)return;
 const status=new URLSearchParams(location.search).get("checkout");
 if(status==="success"){saveCart([]);history.replaceState(null,"",location.pathname);const notice=document.createElement("p");notice.className="form-hint";notice.textContent="Thank you. Stripe will email your receipt. Keep that receipt for your records.";lines.before(notice)}
 if(status==="cancel"){history.replaceState(null,"",location.pathname)}
 const cart=getCart();if(!cart.length){lines.innerHTML='<div class="empty-state">Your bag is empty. <a class="text-link" href="shop.html">Shop the collection</a></div>';actions.innerHTML="";document.getElementById("cart-subtotal").textContent="$0.00";document.getElementById("cart-total").textContent="$0.00";return}
 try{
  const products=await fetchAllProducts(),items=cart.map(c=>({cart:c,p:products.find(p=>p.id===c.id)}));
  if(items.some(x=>!x.p)){lines.innerHTML='<div class="empty-state">An item is no longer available. Remove it from your bag before checkout.</div>';actions.innerHTML="";return}
  let total=0;
  lines.innerHTML=items.map(({cart,p},i)=>{total+=Number(p.price)*cart.qty;return '<article class="cart-line"><img src="'+escapeHTML(p.image_url||"images/chic-by-val-hero.png")+'" alt=""><div class="grow"><div class="row-between"><div><b>'+escapeHTML(p.name)+'</b><div class="form-hint">Quantity '+cart.qty+(cart.size?" · Size "+escapeHTML(cart.size):"")+(cart.color?" · Color "+escapeHTML(cart.color):"")+'</div></div><b>'+formatPrice(Number(p.price)*cart.qty)+'</b></div><button class="remove" data-remove="'+i+'">Remove</button></div></article>'}).join("");
  lines.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{const c=items[Number(b.dataset.remove)].cart;removeFromCart(c.id,c.size||"",c.color||"")});
  document.getElementById("cart-subtotal").textContent=formatPrice(total);document.getElementById("cart-total").textContent=formatPrice(total);
  actions.innerHTML='<button class="btn btn-primary btn-block" id="checkout-bag" type="button">Checkout entire bag</button><p id="checkout-error" class="form-error" role="alert"></p>';
  document.getElementById("checkout-bag").onclick=()=>startCheckout(cart,document.getElementById("checkout-bag"),document.getElementById("checkout-error"));
 }catch(e){console.error(e);lines.innerHTML='<div class="empty-state">The bag could not load. Please try again.</div>';actions.innerHTML=""}
}
document.addEventListener("DOMContentLoaded",updateCartCount);
