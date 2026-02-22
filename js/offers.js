
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

function showToast(msg) {
  var t = document.getElementById('toast');
  var txt = document.getElementById('toastTxt');
  if (!t || !txt) return;
  txt.innerHTML = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}

function subscribeNewsletter() {
  var el = document.getElementById('nlEmail');
  if (!el) return;
  var email = el.value.trim();
  if (!email || email.indexOf('@') === -1) { showToast('⚠️ Enter a valid email!'); return; }
  showToast('🎉 Welcome! Check your inbox for a gift.');
  el.value = '';
}

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

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeCart(); closeLightbox(); }
});

document.addEventListener('DOMContentLoaded', function() {
  fadeObserve();
  var fDate = document.getElementById('fDate');
  if (fDate) fDate.min = new Date().toISOString().split('T')[0];
});

function startCountdown() {
  var end = new Date(); end.setHours(23,59,59,0);
  function tick() {
    var diff = end - new Date(); if (diff < 0) diff = 0;
    var h = Math.floor(diff/3600000);
    var m = Math.floor((diff%3600000)/60000);
    var s = Math.floor((diff%60000)/1000);
    var pad = function(n){ return String(n).padStart(2,'0'); };
    document.getElementById('bHours').innerHTML = pad(h);
    document.getElementById('bMins').innerHTML  = pad(m);
    document.getElementById('bSecs').innerHTML  = pad(s);
    // Happy Hours countdown (till 5pm)
    var now = new Date();
    var happy = new Date(); happy.setHours(17,0,0,0);
    var hd = happy - now; if (hd < 0) hd = 0;
    var hh = Math.floor(hd/3600000); var hm = Math.floor((hd%3600000)/60000); var hs = Math.floor((hd%60000)/1000);
    var el = document.getElementById('oc1');
    if (el) el.innerHTML =
      '<div class="o-box"><div class="o-num">'+pad(hh)+'</div><div class="o-lbl">Hrs</div></div>' +
      '<div class="o-box"><div class="o-num">'+pad(hm)+'</div><div class="o-lbl">Min</div></div>' +
      '<div class="o-box"><div class="o-num">'+pad(hs)+'</div><div class="o-lbl">Sec</div></div>';
  }
  tick(); setInterval(tick, 1000);
}

function claimDeal(code) {
  showToast('🎉 Code copied: ' + code + ' — show at counter!');
}
function copyCode(code) {
  showToast('✅ Code ' + code + ' copied! Show at counter.');
}

var stamps = 0;
function renderStamps() {
  var grid = document.getElementById('stampGrid');
  grid.innerHTML = '';
  for (var i = 0; i < 10; i++) {
    var s = document.createElement('div');
    s.className = 'stamp' + (i < stamps ? ' filled' : '');
    s.innerHTML = i < stamps ? '☕' : '○';
    s.setAttribute('data-i', i);
    s.addEventListener('click', function(){ stampClick(parseInt(this.getAttribute('data-i'))); });
    grid.appendChild(s);
  }
  var msg = document.getElementById('stampMsg');
  if (stamps < 9) { msg.innerHTML = (9 - stamps) + ' more cup' + (9-stamps===1?'':'s') + ' until your FREE coffee!'; }
  else if (stamps === 9) { msg.innerHTML = '🎉 ONE MORE to go — next one is FREE!'; }
  else { msg.innerHTML = '🎊 Congratulations! Claim your FREE coffee at the counter!'; }
}
function stampClick(i) {
  if (i === stamps && stamps < 10) { stamps++; renderStamps(); }
  else if (i === stamps - 1) { stamps--; renderStamps(); }
}
function resetStamps() { stamps = 0; renderStamps(); showToast('Card reset! Start collecting stamps ☕'); }

document.addEventListener('DOMContentLoaded', function(){
  startCountdown();
  renderStamps();
  fadeObserve();
});