const products = [
  {id:1,name:'после дождя',subtitle:'подвеска · серебро',price:8900,category:'pendant',shape:'pendant',image:'product-pendant.jpg',tag:'',featured:1,description:'демонстрационная модель подвески, вдохновлённая тихим моментом после любимой песни.'},
  {id:2,name:'первый аккорд',subtitle:'кольцо · серебро',price:7600,category:'ring',shape:'ring',image:'product-ring.jpg',tag:'',featured:2,description:'демонстрационная модель кольца — маленькое напоминание о начале чего-то важного.'},
  {id:3,name:'на повторе',subtitle:'серьги · серебро',price:10400,category:'earrings',shape:'earrings',image:'product-earrings.jpg',tag:'',featured:3,description:'демонстрационная модель серёг для истории, которую хочется слушать снова.'},
  {id:4,name:'между строк',subtitle:'браслет · серебро',price:6900,category:'bracelet',shape:'chain',image:'product-bracelet.jpg',tag:'',featured:4,description:'демонстрационная модель браслета, в которой остаётся место для личного смысла.'}
];
const rubles = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
let activeCategory = 'all';
let cart = [];
const grid = document.querySelector('#productGrid');
const cartDrawer = document.querySelector('#cartDrawer');
const overlay = document.querySelector('#overlay');
const checkoutModal = document.querySelector('#checkoutModal');
function productArt(product, extra='') { return `<img class="product-art ${product.shape} ${extra}" src="assets/${product.image}" alt="${product.name} — концептуальный мокап из бренд-гайдлайна" loading="lazy">`; }
function visibleProducts(){
  const query=document.querySelector('#searchInput').value.trim().toLocaleLowerCase('ru');
  let list=products.filter(p=>(activeCategory==='all'||p.category===activeCategory)&&`${p.name} ${p.subtitle} ${p.description}`.toLocaleLowerCase('ru').includes(query));
  const sort=document.querySelector('#sortSelect').value;
  if(sort==='low') list.sort((a,b)=>a.price-b.price); else if(sort==='high') list.sort((a,b)=>b.price-a.price); else list.sort((a,b)=>a.featured-b.featured);
  return list;
}
function renderProducts(){
  const list=visibleProducts();
  document.querySelector('#resultCount').textContent=`${list.length} ${list.length===1?'изделие':list.length>1&&list.length<5?'изделия':'изделий'}`;
  grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-image" role="button" tabindex="0" data-detail="${p.id}" aria-label="подробнее: ${p.name}">${productArt(p)}${p.tag?`<span class="product-badge">${p.tag}</span>`:''}<button class="quick-add" data-add="${p.id}">добавить в корзину +</button></div><div class="product-meta"><div><p class="product-name">${p.name}</p><p class="product-subtitle">${p.subtitle}</p></div><span class="product-price">${rubles(p.price)}</span></div></article>`).join(''):'<div class="no-results">ничего не найдено. попробуйте изменить запрос или категорию.</div>';
}
function updateCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0), total=cart.reduce((s,i)=>s+i.qty*i.price,0);
 document.querySelector('#cartCount').textContent=count;document.querySelector('#drawerCount').textContent=`(${count})`;document.querySelector('#cartTotal').textContent=rubles(total);
 document.querySelector('#cartItems').innerHTML=cart.length?cart.map(i=>`<div class="cart-item"><div class="mini-art">${productArt(i)}</div><div><p class="cart-item-name">${i.name}</p><span class="cart-item-price">${rubles(i.price)}</span><div class="qty-controls"><button data-qty="${i.id}" data-delta="-1" aria-label="уменьшить количество">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1" aria-label="увеличить количество">+</button></div></div><button class="remove-item" data-remove="${i.id}" aria-label="удалить ${i.name}">×</button></div>`).join(''):'<p class="empty-cart">пока здесь пусто — добавьте украшение, которое вам откликнулось.</p>';
 document.querySelector('#checkoutOpen').disabled=!cart.length;document.querySelector('#checkoutOpen').style.opacity=cart.length?'1':'.45';
}
function addToCart(id){const p=products.find(x=>x.id===Number(id));if(!p)return;const found=cart.find(x=>x.id===p.id);found?found.qty++:cart.push({...p,qty:1});updateCart();openCart();}
function showOverlay(){overlay.hidden=false;document.body.style.overflow='hidden'}
function hideOverlay(){overlay.hidden=true;document.body.style.overflow='';cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');checkoutModal.hidden=true}
function openCart(){showOverlay();cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false')}
function openCheckout(){cartDrawer.classList.remove('open');checkoutModal.hidden=false;document.querySelector('#formSuccess').hidden=true;}
document.querySelectorAll('.filter-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCategory=b.dataset.category;renderProducts()}));
document.querySelector('#searchInput').addEventListener('input',renderProducts);document.querySelector('#sortSelect').addEventListener('change',renderProducts);
grid.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){e.stopPropagation();addToCart(add.dataset.add);return;}const detail=e.target.closest('[data-detail]');if(detail){const p=products.find(x=>x.id===Number(detail.dataset.detail));if(p)alert(`${p.name}\n${p.description}\n\n${rubles(p.price)}\n\nэто демонстрационная карточка. перед запуском добавьте реальные фото и характеристики.`)}});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){e.preventDefault();e.target.click()}});
document.querySelector('#cartOpen').addEventListener('click',openCart);document.querySelector('#cartClose').addEventListener('click',hideOverlay);document.querySelector('#checkoutOpen').addEventListener('click',openCheckout);document.querySelector('#checkoutClose').addEventListener('click',hideOverlay);overlay.addEventListener('click',hideOverlay);
document.querySelector('#cartItems').addEventListener('click',e=>{const qty=e.target.closest('[data-qty]');const rem=e.target.closest('[data-remove]');if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id)}updateCart()}if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));updateCart()}});
document.querySelector('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const items=cart.map(i=>`${i.name} × ${i.qty} — ${rubles(i.price*i.qty)}`).join('\n');const deliveryLabel=data.get('delivery')==='courier'?'СДЭК — курьер (демо)':'СДЭК — пункт выдачи (демо)';const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const success=document.querySelector('#formSuccess');success.innerHTML=`<strong>демонстрационная заявка подготовлена</strong><br><br>${String(data.get('name')).replace(/[<>]/g,'')}<br>${String(data.get('contact')).replace(/[<>]/g,'')}<br><br>${deliveryLabel}<br><br>${items.replace(/\n/g,'<br>')}<br><br><strong>итого: ${rubles(total)}</strong><br><br>Форма пока не подключена к почте или серверу. Ничего не отправлено.`;success.hidden=false;});
document.querySelector('#menuToggle').addEventListener('click',()=>{const nav=document.querySelector('#mainNav');const open=nav.classList.toggle('open');document.querySelector('#menuToggle').setAttribute('aria-expanded',String(open));document.querySelector('#menuToggle').textContent=open?'×':'☰'});
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#mainNav').classList.remove('open');document.querySelector('#menuToggle').setAttribute('aria-expanded','false');document.querySelector('#menuToggle').textContent='☰'}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideOverlay()});
renderProducts();updateCart();
