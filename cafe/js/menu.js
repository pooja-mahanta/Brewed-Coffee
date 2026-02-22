
var cart = [];

function addToCart(name, price) {
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) { cart[i].qty++; found = true; break; }
  }
  if (!found) { cart.push({ name: name, price: price, qty: 1 }); }
  syncCartUI();
  showToast('Added: ' + name + ' ☕');
}

function removeOne(name) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty--;
      if (cart[i].qty <= 0) { cart.splice(i, 1); }
      break;
    }
  }
  syncCartUI();
  renderCartPanel();
}

function clearCart() {
  cart = [];
  syncCartUI();
  renderCartPanel();
}

function syncCartUI() {
  var qty = cart.reduce(function(s, c) { return s + c.qty; }, 0);
  var fab = document.getElementById('cartFab');
  if (fab) fab.style.display = qty > 0 ? 'flex' : 'none';
  var fc = document.getElementById('fabCount');
  if (fc) fc.innerHTML = qty;
  var nc = document.getElementById('navCount');
  if (nc) nc.innerHTML = qty;
}

function renderCartPanel() {
  var el = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  var empty = document.getElementById('cartEmpty');
  if (!el) return;
  el.innerHTML = '';
  if (cart.length === 0) {
    if (footer) footer.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (footer) footer.style.display = 'block';
  var total = 0;
  cart.forEach(function(c) {
    total += c.price * c.qty;
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div style="flex:1;">' +
        '<div class="cart-item-name">' + c.name + '</div>' +
        '<div class="cart-item-price">₹' + (c.price * c.qty) + '</div>' +
      '</div>' +
      '<div class="d-flex align-items-center gap-2">' +
        '<button class="qty-btn" onclick="removeOne(\'' + c.name.replace(/'/g,"\\'") + '\')">−</button>' +
        '<span style="font-weight:700;min-width:18px;text-align:center;">' + c.qty + '</span>' +
        '<button class="qty-btn" onclick="addToCart(\'' + c.name.replace(/'/g,"\\'") + '\',' + c.price + ')">+</button>' +
      '</div>';
    el.appendChild(div);
  });
  var ct = document.getElementById('cartTotal');
  if (ct) ct.innerHTML = '₹' + total;
}

function openCart() {
  renderCartPanel();
  var ov = document.getElementById('cartOverlay');
  if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeCart() {
  var ov = document.getElementById('cartOverlay');
  if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
}

function closeOutside(e) {
  if (e.target === document.getElementById('cartOverlay')) { closeCart(); }
}

function placeOrder() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  cart = [];
  syncCartUI();
  renderCartPanel();
  closeCart();
  showToast('✅ Order placed! Ready in 5 mins!');
}

// ===== LIGHTBOX =====
function openLightbox(src) {
  var img = document.getElementById('lightboxImg');
  var lb = document.getElementById('lightbox');
  if (img) img.src = typeof src === 'string' ? src : src.querySelector('img').src;
  if (lb) { lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeLightbox() {
  var lb = document.getElementById('lightbox');
  if (lb) { lb.classList.remove('open'); document.body.style.overflow = ''; }
}

// ===== TOAST =====
function showToast(msg) {
  var t = document.getElementById('toast');
  var txt = document.getElementById('toastTxt');
  if (!t || !txt) return;
  txt.innerHTML = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

// ===== NEWSLETTER =====
function subscribeNewsletter() {
  var el = document.getElementById('nlEmail');
  if (!el) return;
  var email = el.value.trim();
  if (!email || email.indexOf('@') === -1) { showToast('⚠️ Enter a valid email!'); return; }
  showToast('🎉 Welcome! Check your inbox for a gift.');
  el.value = '';
}

// ===== RESERVATION (contact page) =====
function submitReservation() {
  var name   = document.getElementById('fName') ? document.getElementById('fName').value.trim() : '';
  var phone  = document.getElementById('fPhone') ? document.getElementById('fPhone').value.trim() : '';
  var date   = document.getElementById('fDate') ? document.getElementById('fDate').value : '';
  var time   = document.getElementById('fTime') ? document.getElementById('fTime').value : '';
  var guests = document.getElementById('fGuests') ? document.getElementById('fGuests').value : '';
  if (!name || !phone || !date || !time || !guests) { showToast('⚠️ Please fill all required fields!'); return; }
  var msg = document.getElementById('successMsg');
  if (msg) msg.style.display = 'block';
  ['fName','fPhone','fEmail','fNote'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  ['fDate','fTime','fGuests','fSeating','fOccasion'].forEach(function(id) {
    var el = document.getElementById(id); if (el) el.value = '';
  });
  setTimeout(function() { if (msg) msg.style.display = 'none'; }, 7000);
}

// ===== FADE OBSERVER =====
function fadeObserve() {
  var els = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el) { obs.observe(el); });
  } else {
    els.forEach(function(el) { el.classList.add('visible'); });
  }
}

// ===== ESCAPE KEY =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeCart(); closeLightbox(); }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  fadeObserve();
  // Set min date for reservation
  var fDate = document.getElementById('fDate');
  if (fDate) fDate.min = new Date().toISOString().split('T')[0];
});

var menuItems = [
  {category:"coffee",  name:"Classic Espresso",      desc:"Bold, rich single-origin espresso shot.",          price:120, img:"https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80"},
  {category:"coffee",  name:"Cappuccino",             desc:"Velvety milk foam with double espresso.",           price:180, img:"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80"},
  {category:"coffee",  name:"Flat White",             desc:"Smooth microfoam over ristretto shots.",            price:200, img:"https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80"},
  {category:"coffee",  name:"Signature Latte",        desc:"House blend with oat milk & caramel drizzle.",     price:220, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80"},
  {category:"coffee",  name:"Americano",              desc:"Espresso diluted with hot water, bold & clean.",    price:140, img:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"},
  {category:"coffee",  name:"Macchiato",              desc:"Espresso stained with a dash of foamy milk.",       price:160, img:"https://images.unsplash.com/photo-1608591038246-4981d06b11e1?q=80&w=1002&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
  {category:"cold",    name:"Cold Brew",              desc:"18-hour slow-steeped coffee over ice.",             price:200, img:"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80"},
  {category:"cold",    name:"Iced Caramel Macchiato", desc:"Espresso over chilled milk with caramel swirl.",   price:230, img:"https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80"},
  {category:"cold",    name:"Mango Cold Brew",        desc:"Tropical twist on our classic cold brew.",          price:250, img:"https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500&q=80"},
  {category:"cold",    name:"Sparkling Tonic Coffee", desc:"Fizzy, refreshing espresso tonic delight.",         price:260, img:"https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80"},
  {category:"food",    name:"Butter Croissant",       desc:"Buttery, flaky French-style golden croissant.",     price:120, img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80"},
  {category:"food",    name:"Avocado Toast",          desc:"Sourdough with smashed avocado & mixed seeds.",     price:280, img:"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500&q=80"},
  {category:"food",    name:"Blueberry Muffin",       desc:"Moist, golden muffin bursting with berries.",       price:100, img:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80"},
  {category:"food",    name:"Granola Yogurt Bowl",    desc:"Greek yogurt, seasonal fruits & raw honey.",        price:240, img:"https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=500&q=80"},
  {category:"special", name:"Dalgona Coffee",         desc:"Whipped coffee cloud over creamy milk — viral hit.",price:260, img:"https://media.istockphoto.com/id/1324007808/photo/dalgona-coffee-with-coffee-beans-on-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=IJaDxwL_asxTI6jX1ldUpWjmYOfnJcuMgaUxfPYpWXI="},
  {category:"special", name:"Rose Cardamom Latte",    desc:"Floral spiced latte — our signature fusion blend.", price:280, img:"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80"},
];

function filterMenu(e, cat) {
  document.querySelectorAll('.menu-tabs .nav-link').forEach(function(b){ b.classList.remove('active'); });
  e.target.classList.add('active');
  renderMenuGrid(cat);
}

function renderMenuGrid(cat) {
  var grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  var list = cat === 'all' ? menuItems : menuItems.filter(function(x){ return x.category === cat; });
  list.forEach(function(item, i) {
    var col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-3 fade-up';
    col.style.animationDelay = (i * 0.05) + 's';
    col.innerHTML =
      '<div class="menu-card">' +
      '<img src="' + item.img + '" alt="' + item.name + '" class="menu-card-img" loading="lazy"/>' +
      (item.category === 'special' ? '<div class="menu-badge">Chef\'s Special</div>' : '') +
      '<div class="menu-card-body">' +
        '<div class="menu-card-title">' + item.name + '</div>' +
        '<p class="menu-card-desc">' + item.desc + '</p>' +
        '<div class="d-flex justify-content-between align-items-center mt-3">' +
          '<span class="menu-card-price">₹' + item.price + '</span>' +
          '<button class="btn-order" onclick="addToCart(\'' + item.name.replace(/'/g,"\\'")+  '\',' + item.price + ')">+ Add</button>' +
        '</div>' +
      '</div></div>';
    grid.appendChild(col);
    setTimeout(function(){ col.classList.add('visible'); }, 50 + i * 60);
  });
}

document.addEventListener('DOMContentLoaded', function(){
  renderMenuGrid('all');
  fadeObserve();
});
