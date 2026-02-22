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
            if (cart[i].qty <= 0) cart.splice(i, 1);
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
    var qty = cart.reduce(function (s, c) { return s + c.qty; }, 0);
    var fab = document.getElementById('cartFab');
    if (fab) fab.style.display = qty > 0 ? 'flex' : 'none';
    var fc = document.getElementById('fabCount');
    if (fc) fc.innerHTML = qty;
}

/* ================= CART PANEL ================= */
function renderCartPanel() {
    var el = document.getElementById('cartItems');
    if (!el) return;
    el.innerHTML = '';
    var total = 0;

    cart.forEach(function (c) {
        total += c.price * c.qty;
        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<div style="flex:1;">' +
            '<div class="cart-item-name">' + c.name + '</div>' +
            '<div class="cart-item-price">₹' + (c.price * c.qty) + '</div>' +
            '</div>' +
            '<div class="d-flex align-items-center gap-2">' +
            '<button class="qty-btn" onclick="removeOne(\'' + c.name + '\')">−</button>' +
            '<span>' + c.qty + '</span>' +
            '<button class="qty-btn" onclick="addToCart(\'' + c.name + '\',' + c.price + ')">+</button>' +
            '</div>';
        el.appendChild(div);
    });

    var ct = document.getElementById('cartTotal');
    if (ct) ct.innerHTML = '₹' + total;
}

/* ================= LIGHTBOX ================= */
function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
}

/* ================= TOAST ================= */
function showToast(msg) {
    var t = document.getElementById('toast');
    var txt = document.getElementById('toastTxt');
    if (!t || !txt) return;
    txt.innerHTML = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3000);
}

/* ================= FADE ANIMATION ================= */
function fadeObserve() {
    var els = document.querySelectorAll('.fade-up');
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
}


var photos = [
  {cat:"interior", src:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", label:"Cafe Interior"},
  {cat:"drinks", src:"https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80", label:"Cappuccino"},
  {cat:"food", src:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80", label:"Croissants"},
  {cat:"interior", src:"https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80", label:"Barista at Work"},
  {cat:"barista", src:"https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=800&q=80", label:"Hot Coffee"},
  {cat:"interior", src:"https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80", label:"Cozy Seating"},
  {cat:"drinks", src:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80", label:"Latte"},
  {cat:"food", src:"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&q=80", label:"Avocado Toast"},
  {cat:"barista", src:"https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80", label:"Latte Art"},
  {cat:"interior", src:"https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80", label:"Our Tables"},
  {cat:"drinks", src:"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80", label:"Cold Brew"},
  {cat:"food", src:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80", label:"Blueberry Muffin"},
  {cat:"drinks", src:"https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800&q=80", label:"Iced Macchiato"},
  {cat:"interior", src:"https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80", label:"Window View"},
  {cat:"food", src:"https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=800&q=80", label:"Granola Bowl"},
  {cat:"barista", src:"https://images.unsplash.com/photo-1522992319-0365e5f11656?w=800&q=80", label:"Making Coffee"}
];


function filterGallery(e, cat) {
    document.querySelectorAll('.gallery-filter .nav-link')
        .forEach(function (b) { b.classList.remove('active'); });
    e.target.classList.add('active');
    renderGallery(cat);
}

function renderGallery(cat) {
    var grid = document.getElementById('galGrid');
    grid.innerHTML = '';
    var list = cat === 'all' ? photos : photos.filter(p => p.cat === cat);

    list.forEach(function (p) {
        var item = document.createElement('div');
        item.className = 'gal-item';
        item.innerHTML =
            '<img src="' + p.src + '">' +
            '<div class="gal-overlay"><i class="bi bi-zoom-in"></i>' +
            '<div class="gal-label">' + p.label + '</div></div>';
        item.addEventListener('click', function () {
            openLightbox(p.src);
        });
        grid.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderGallery('all');
    fadeObserve();
});