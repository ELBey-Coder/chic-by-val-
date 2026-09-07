const SITE_KNOWLEDGE=[
 {keys:["hello","hi","hey"],answer:"Hello! I’m the Chic by Val Style Assistant. Ask me about products, sizing, pickup, shipping, returns, or checkout."},
 {keys:["pickup","local"],answer:"Complimentary local pickup is available in Indian Head, Maryland. Valerie will arrange the pickup details after purchase."},
 {keys:["shipping","delivery","arrive","track"],answer:"Available shipping options and timing are shown during secure Stripe checkout. Contact Valerie before ordering if you need an item by a specific date."},
 {keys:["return","refund","exchange"],answer:"Eligible unworn items with tags may be exchanged within 14 days. Contact Valerie with your order details before returning an item."},
 {keys:["size","fit","measurement"],answer:"Available sizes appear on each product page. For fit help, send the product name and your question through the Contact page."},
 {keys:["pay","payment","stripe","checkout","card"],answer:"Payments are completed on Stripe’s secure checkout page. Chic by Val never stores your card details."},
 {keys:["contact","email","human","valerie"],answer:"You can contact Valerie at achuval@yahoo.com or use the Contact page."},
 {keys:["admin","login","upload","dashboard"],answer:"The protected Admin area lets Valerie add, edit, and remove products. The Admin login is linked in the footer."},
 {keys:["hours","open"],answer:"The online shop is open 24/7. Messages are answered as soon as possible."}
];
let chatProducts=[];
async function chatReply(text){
  const q=text.toLowerCase();
  if(!chatProducts.length){try{chatProducts=await fetchAllProducts()}catch(e){}}
  const product=chatProducts.find(p=>q.includes(String(p.name||"").toLowerCase()));
  if(product)return product.name+" is "+formatPrice(product.price)+". "+truncate(product.description,120)+" Available sizes: "+(product.sizes||"see product page")+".";
  const category=[...new Set(chatProducts.map(p=>p.category).filter(Boolean))].find(c=>q.includes(c.toLowerCase()));
  if(category){const matches=chatProducts.filter(p=>p.category===category);return "We currently show "+matches.length+" "+category.toLowerCase()+" item"+(matches.length===1?"":"s")+": "+matches.slice(0,4).map(p=>p.name).join(", ")+"."}
  return SITE_KNOWLEDGE.find(x=>x.keys.some(k=>q.includes(k)))?.answer||"I can help with products, sizing, pickup, shipping, returns, checkout, or contacting Valerie. Try one of those topics.";
}
function appendChat(text,who){const body=document.getElementById("vc-chat-body"),m=document.createElement("div");m.className="vc-msg "+who;m.textContent=text;body.appendChild(m);body.scrollTop=body.scrollHeight}
async function handleChat(text){appendChat(text,"user");appendChat(await chatReply(text),"bot")}
document.addEventListener("DOMContentLoaded",()=>{
 const launch=document.getElementById("vc-chat-launcher"),win=document.getElementById("vc-chat-window"),close=document.getElementById("vc-chat-close"),form=document.getElementById("vc-chat-form"),input=document.getElementById("vc-chat-input"),quick=document.getElementById("vc-quick-replies");if(!launch)return;
 ["Sizing help","Local pickup","Returns","Secure checkout"].forEach(label=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.onclick=()=>handleChat(label);quick.appendChild(b)});
 launch.onclick=()=>{const open=!win.classList.contains("open");win.classList.toggle("open",open);win.setAttribute("aria-hidden",String(!open));if(open&&!document.getElementById("vc-chat-body").children.length)appendChat("Hi! What can I help you find today?","bot")};close.onclick=()=>{win.classList.remove("open");win.setAttribute("aria-hidden","true")};form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(text){input.value="";handleChat(text)}};
});
