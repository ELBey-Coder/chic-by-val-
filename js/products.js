function formatPrice(value){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(value)||0)}
function escapeHTML(value){const d=document.createElement("div");d.textContent=value??"";return d.innerHTML}
function truncate(value,n=78){value=String(value||"");return value.length>n?value.slice(0,n).trim()+"...":value}
async function fetchAllProducts(){
  if(!storeDB)return DEMO_PRODUCTS;
  const {data,error}=await storeDB.from("products").select("*").eq("active",true).order("created_at",{ascending:false});
  if(error)throw error;return data||[];
}
async function fetchProductById(id){
  if(String(id).startsWith("demo-"))return DEMO_PRODUCTS.find(p=>p.id===id)||null;
  if(!storeDB)return null;
  const {data,error}=await storeDB.from("products").select("*").eq("id",id).single();
  if(error)return null;return data;
}
function productCardHTML(p){
  const img=p.image_url||"images/chic-by-val-hero.png";
  const needsOptions=variants(p.sizes).length||variants(p.colors).length;
  return '<article class="product-card"><a class="thumb" href="product.html?id='+encodeURIComponent(p.id)+'"><img src="'+escapeHTML(img)+'" alt="'+escapeHTML(p.name)+'" loading="lazy"></a><div class="info"><span class="cat">'+escapeHTML(p.category||"Collection")+'</span><h3><a href="product.html?id='+encodeURIComponent(p.id)+'">'+escapeHTML(p.name)+'</a></h3><p class="desc">'+escapeHTML(truncate(p.description))+'</p><div class="price">'+formatPrice(p.price)+'</div><div class="card-actions"><a class="btn btn-outline" href="product.html?id='+encodeURIComponent(p.id)+'">Details</a>'+(needsOptions?'<a class="btn btn-primary" href="product.html?id='+encodeURIComponent(p.id)+'">Choose options</a>':'<button class="btn btn-primary" onclick="addToCart(\''+String(p.id).replace(/'/g,"")+'\',1)">Add</button>')+'</div></div></article>';
}
async function renderProductGrid(id,{category=null,limit=null}={}){
  const el=document.getElementById(id);if(!el)return;
  try{let products=await fetchAllProducts();if(category)products=products.filter(p=>(p.category||"").toLowerCase()===category.toLowerCase());if(limit)products=products.slice(0,limit);el.innerHTML=products.length?products.map(productCardHTML).join(""):'<div class="empty-state">Val is preparing new pieces. Please check back soon.</div>'}
  catch(e){console.error(e);el.innerHTML='<div class="empty-state">The collection could not load. Please refresh the page.</div>'}
}

function variants(value){return String(value||"").split(",").map(x=>x.trim()).filter(Boolean)}
async function setupShopFilters(initial){
 const category=document.getElementById("category-filter"),size=document.getElementById("size-filter"),color=document.getElementById("color-filter"),grid=document.getElementById("shop-grid");category.value=initial;
 try{const products=await fetchAllProducts();for(const [el,key] of [[size,"sizes"],[color,"colors"]]){const choices=[...new Set(products.flatMap(p=>variants(p[key])))].sort();choices.forEach(v=>{const option=document.createElement("option");option.value=v;option.textContent=v;el.appendChild(option)})}
 const draw=()=>{const filtered=products.filter(p=>(!category.value||p.category===category.value||(category.value==="Women's clothing"&&["Dresses","Sets","Tops","Bottoms","Accessories"].includes(p.category)))&&(!size.value||variants(p.sizes).includes(size.value))&&(!color.value||variants(p.colors).includes(color.value)));grid.innerHTML=filtered.length?filtered.map(productCardHTML).join(""):'<div class="empty-state">No items match these filters.</div>'};[category,size,color].forEach(el=>el.addEventListener("change",draw));draw()}
 catch(e){console.error(e);grid.innerHTML='<div class="empty-state">The collection could not load. Please refresh the page.</div>'}
}
