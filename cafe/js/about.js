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
    var qty = cart.reduce(function (s, c) { return s + c.qty; }, 0);
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
            '<button class="qty-btn" onclick="removeOne(\'' + c.name.replace(/'/g, "\\'") + '\')">−</button>' +
            '<span style="font-weight:700;min-width:18px;text-align:center;">' + c.qty + '</span>' +
            '<button class="qty-btn" onclick="addToCart(\'' + c.name.replace(/'/g, "\\'") + '\',' + c.price + ')">+</button>' +
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

//LIGHTBOX
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

//TOAST
function showToast(msg) {
    var t = document.getElementById('toast');
    var txt = document.getElementById('toastTxt');
    if (!t || !txt) return;
    txt.innerHTML = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3000);
}

//NEWSLETTER
function subscribeNewsletter() {
    var el = document.getElementById('nlEmail');
    if (!el) return;
    var email = el.value.trim();
    if (!email || email.indexOf('@') === -1) { showToast('⚠️ Enter a valid email!'); return; }
    showToast('🎉 Welcome! Check your inbox for a gift.');
    el.value = '';
}

//RESERVATION
function submitReservation() {
    var name = document.getElementById('fName') ? document.getElementById('fName').value.trim() : '';
    var phone = document.getElementById('fPhone') ? document.getElementById('fPhone').value.trim() : '';
    var date = document.getElementById('fDate') ? document.getElementById('fDate').value : '';
    var time = document.getElementById('fTime') ? document.getElementById('fTime').value : '';
    var guests = document.getElementById('fGuests') ? document.getElementById('fGuests').value : '';
    if (!name || !phone || !date || !time || !guests) { showToast('⚠️ Please fill all required fields!'); return; }
    var msg = document.getElementById('successMsg');
    if (msg) msg.style.display = 'block';
    ['fName', 'fPhone', 'fEmail', 'fNote'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = '';
    });
    ['fDate', 'fTime', 'fGuests', 'fSeating', 'fOccasion'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = '';
    });
    setTimeout(function () { if (msg) msg.style.display = 'none'; }, 7000);
}

//FADE OBSERVER
function fadeObserve() {
    var els = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el) { obs.observe(el); });
    } else {
        els.forEach(function (el) { el.classList.add('visible'); });
    }
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeCart(); closeLightbox(); }
});

document.addEventListener('DOMContentLoaded', function () {
    fadeObserve();
    var fDate = document.getElementById('fDate');
    if (fDate) fDate.min = new Date().toISOString().split('T')[0];
});
