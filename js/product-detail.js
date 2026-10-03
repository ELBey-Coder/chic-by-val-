(async()=>{
 const p=await fetchProductById(new URLSearchParams(location.search).get("id")),el=document.getElementById("product-view");
 if(!p){el.innerHTML='<div class="empty-state">Product not found. <a href="shop.html">Return to shop</a></div>';return}
 document.title=p.name+" | Chic by Val";
 const sizes=sizeVariants(p.sizes),colors=variants(p.colors);
 const select=(id,label,options)=>options.length?'<label for="'+id+'">'+label+'<select id="'+id+'" required><option value="">Select '+label.toLowerCase()+'</option>'+options.map(x=>'<option value="'+escapeHTML(x)+'">'+escapeHTML(x)+'</option>').join("")+'</select></label>':'';
 el.innerHTML='<article class="product-detail"><div class="gallery"><img src="'+escapeHTML(p.image_url||"images/chic-by-val-hero.png")+'" alt="'+escapeHTML(p.name)+'"></div><div><p class="eyebrow">'+escapeHTML(p.category||"Collection")+'</p><h1>'+escapeHTML(p.name)+'</h1><div class="price">'+formatPrice(p.price)+'</div><p>'+escapeHTML(p.description||"")+'</p><div class="variant-options">'+select("selected-size","Size",sizes)+select("selected-color","Color",colors)+'</div><div class="meta-list"><div><span>Material</span><b>'+escapeHTML(p.material||"See description")+'</b></div></div><div class="detail-actions"><button id="add-product" class="btn btn-outline">Add to bag</button><button id="buy-product" class="btn btn-primary">Buy Now</button></div><p id="purchase-note" class="form-hint" aria-live="polite"></p></div></article>';
 function selection(){const size=document.getElementById("selected-size")?.value||"",color=document.getElementById("selected-color")?.value||"";if((sizes.length&&!size)||(colors.length&&!color)){document.getElementById("purchase-note").textContent="Choose a size and color before continuing.";return null}return {size,color}}
 document.getElementById("add-product").onclick=()=>{const v=selection();if(v)addToCart(p.id,1,v.size,v.color)};
 document.getElementById("buy-product").onclick=()=>{const v=selection();if(!v)return;const button=document.getElementById("buy-product");startCheckout([{id:p.id,qty:1,size:v.size,color:v.color}],button,document.getElementById("purchase-note"),"buy-now")};
})();
