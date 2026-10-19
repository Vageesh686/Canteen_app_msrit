/*
  MSRIT Canteen — Student Portal
  --------------------------------
  In-memory prototype, same underlying model as the faculty portal
  (Order/CartItem/MenuItem) plus student-only gamification fields
  (streak, xp, badges) layered on top. Swap seed data + TODOs for
  real API calls once there's a backend.
*/

const App = (() => {
  let student = null;

  const stalls = [
    { id: 'S1', name: 'Dosa Corner', emoji: '🥞', meta: '4.8 ★ · 6 min' },
    { id: 'S2', name: 'Chaat Street', emoji: '🥘', meta: '4.6 ★ · 9 min' },
    { id: 'S3', name: 'Juice Junction', emoji: '🥤', meta: '4.7 ★ · 3 min' },
    { id: 'S4', name: 'Grill House', emoji: '🍔', meta: '4.5 ★ · 10 min' }
  ];

  const menu = [
    { id: 'I1', stall: 'S1', name: 'Masala Dosa', price: 40, icon: '🥞', available: true, votes: 182, trending: true },
    { id: 'I2', stall: 'S1', name: 'Rava Idli (3pc)', price: 35, icon: '🍚', available: true, votes: 64 },
    { id: 'I3', stall: 'S2', name: 'Pani Puri (6pc)', price: 30, icon: '🥣', available: true, votes: 211, trending: true },
    { id: 'I4', stall: 'S2', name: 'Bhel Puri', price: 35, icon: '🥗', available: true, votes: 98 },
    { id: 'I5', stall: 'S3', name: 'Mango Shake', price: 45, icon: '🥭', available: true, votes: 140 },
    { id: 'I6', stall: 'S3', name: 'Cold Coffee', price: 40, icon: '🧋', available: false, votes: 77 },
    { id: 'I7', stall: 'S4', name: 'Veg Burger', price: 55, icon: '🍔', available: true, votes: 156, trending: true },
    { id: 'I8', stall: 'S4', name: 'Loaded Fries', price: 50, icon: '🍟', available: true, votes: 120 }
  ];

  let activeStall = 'S1';
  let cart = {};
  let orders = [];
  let orderSeq = 1;
  let streak = 3;
  let xp = 240;
  const badges = [
    { icon: '🌅', label: 'Early Bird', earned: true },
    { icon: '🔥', label: '3-day streak', earned: true },
    { icon: '🥇', label: 'Top voter', earned: false },
    { icon: '🍛', label: 'Thali master', earned: false }
  ];

  const queueMessages = [
    '🔥 Dosa Corner: 12 orders in queue', '⚡ Chaat Street: 2 min avg wait',
    '🥤 Juice Junction: no wait right now', '🍔 Grill House: trending — Veg Burger',
    '🎉 42 students ordered in the last hour'
  ];

  // ---------------- Utilities ----------------
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._h);
    toast._h = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#FF3E6C', '#FFC737', '#33E6B8'] });
    }
  }

  function updateBadgesUI() {
    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const dot = document.getElementById('cartDot');
    dot.style.display = cartCount ? 'block' : 'none';
  }

  // ---------------- Auth ----------------
  function login() {
    const usn = document.getElementById('usn').value.trim();
    const pw = document.getElementById('pw').value.trim();
    const err = document.getElementById('loginError');
    if (!usn || !pw) { err.style.display = 'block'; return; }
    err.style.display = 'none';

    student = { usn: usn || '1MS22CS045' };
    document.getElementById('screen-login').classList.remove('active');
    document.getElementById('appShell').style.display = 'block';
    document.getElementById('streakCount').textContent = streak;
    startTicker();
    renderStalls();
    renderMenu();
    renderProfile();
    show('home');
  }

  function logout() {
    student = null; cart = {};
    document.getElementById('appShell').style.display = 'none';
    document.getElementById('screen-login').classList.add('active');
    document.getElementById('usn').value = ''; document.getElementById('pw').value = '';
  }

  function startTicker() {
    const track = document.getElementById('tickerTrack');
    track.textContent = queueMessages.join('   ·   ');
  }

  // ---------------- Navigation ----------------
  function show(tab) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + tab).classList.add('active');
    document.querySelectorAll('nav.tabs [data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    if (tab === 'cart') renderCart();
    if (tab === 'orders') renderOrders();
    if (tab === 'profile') renderProfile();
  }

  // ---------------- Stalls / menu ----------------
  function renderStalls() {
    document.getElementById('stallScroll').innerHTML = stalls.map(s => `
      <div class="stall-card ${s.id === activeStall ? 'active' : ''}" onclick="App.setStall('${s.id}')">
        <div class="emoji">${s.emoji}</div>
        <div class="name">${s.name}</div>
        <div class="meta">${s.meta}</div>
      </div>`).join('');
    const current = stalls.find(s => s.id === activeStall);
    document.getElementById('stallLabel').textContent = current.name;
  }

  function setStall(id) { activeStall = id; renderStalls(); renderMenu(); }

  function renderMenu() {
    const items = menu.filter(m => m.stall === activeStall);
    document.getElementById('menuGrid').innerHTML = items.map(m => `
      <div class="food-card ${m.available ? '' : 'unavailable'}">
        ${m.trending ? `<span class="badge-corner">🔥 trending</span>` : ''}
        <div class="thumb">${m.icon}</div>
        <div class="body">
          <div class="name">${m.name}</div>
          <div class="votes">👍 ${m.votes} students like this</div>
          <div class="row-bottom">
            <span class="price">₹${m.price}</span>
            ${m.available
              ? `<div class="qty">
                   <button onclick="App.changeQty('${m.id}',-1)" aria-label="Remove one">−</button>
                   <span id="qty-${m.id}">${cart[m.id] || 0}</span>
                   <button onclick="App.changeQty('${m.id}',1)" aria-label="Add one">+</button>
                 </div>`
              : `<span style="font-size:11px;color:var(--muted)">Sold out</span>`}
          </div>
        </div>
      </div>`).join('');
  }

  function changeQty(id, delta) {
    const next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id]; else cart[id] = next;
    const el = document.getElementById('qty-' + id);
    if (el) el.textContent = cart[id] || 0;
    updateBadgesUI();
  }

  // ---------------- Cart ----------------
  function cartLines() {
    return Object.entries(cart).map(([id, qty]) => {
      const item = menu.find(m => m.id === id);
      return { item, qty, subtotal: item.price * qty };
    });
  }

  function renderCart() {
    const el = document.getElementById('cartArea');
    const lines = cartLines();
    if (!lines.length) {
      el.innerHTML = `<div class="empty"><div class="ic">🍽️</div>Your tray is empty<br><span style="font-size:13px">Go grab something from Home.</span></div>`;
      return;
    }
    const total = lines.reduce((s, l) => s + l.subtotal, 0);
    el.innerHTML = `
      <div class="panel">
        ${lines.map(l => `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0">
            <div style="font-size:22px">${l.item.icon}</div>
            <div style="flex:1"><div style="font-weight:700">${l.item.name}</div><div style="font-size:12px;color:var(--muted)">₹${l.item.price} × ${l.qty}</div></div>
            <b>₹${l.subtotal}</b>
          </div>`).join('')}
      </div>
      <div class="panel">
        <div class="line-total grand"><span>Total</span><span>₹${total}</span></div>
        <label for="slot">Pickup slot</label>
        <select id="slot"><option>12:00 – 12:10</option><option>12:10 – 12:20</option><option>1:30 – 1:40</option></select>
        <label for="payMode">Pay with</label>
        <select id="payMode"><option value="UPI">UPI</option><option value="WALLET">Campus wallet</option><option value="COUNTER">Pay at counter</option></select>
        <button class="btn btn-hot block" onclick="App.placeOrder()">Order now · ₹${total} 🚀</button>
      </div>`;
  }

  function placeOrder() {
    const lines = cartLines();
    if (!lines.length) return;
    const slot = document.getElementById('slot').value;
    const payMode = document.getElementById('payMode').value;
    const total = lines.reduce((s, l) => s + l.subtotal, 0);

    orders.unshift({
      orderId: 'ORD-' + String(orderSeq++).padStart(3, '0'),
      items: lines.map(l => ({ name: l.item.name, unitPrice: l.item.price, quantity: l.qty })),
      total, slot, payMode,
      state: 'ACCEPTED',
      placedAt: new Date()
    });
    cart = {};
    updateBadgesUI();
    xp += 15;
    toast('Order placed — +15 XP 🎉');
    fireConfetti();
    show('orders');
  }

  // ---------------- Orders ----------------
  const STEPS = [
    { key: 'ACCEPTED', label: 'Placed', icon: '📝' },
    { key: 'PREPARING', label: 'Cooking', icon: '👨‍🍳' },
    { key: 'READY', label: 'Ready', icon: '🛎️' },
    { key: 'COLLECTED', label: 'Picked up', icon: '✅' }
  ];

  function cancelOrder(id) {
    const o = orders.find(o => o.orderId === id);
    if (!o || o.state === 'COLLECTED' || o.state === 'CANCELLED') return;
    o.state = 'CANCELLED';
    toast('Order cancelled');
    renderOrders();
  }

  function advanceOrder(id) {
    const o = orders.find(o => o.orderId === id);
    if (!o) return;
    const idx = STEPS.findIndex(s => s.key === o.state);
    if (idx > -1 && idx < STEPS.length - 1) {
      o.state = STEPS[idx + 1].key;
      if (o.state === 'READY') toast('Order ready — go grab it! 🛎️');
      if (o.state === 'COLLECTED') { toast('Enjoy your meal! 😋'); fireConfetti(); }
      renderOrders();
    }
  }

  function renderOrders() {
    const el = document.getElementById('ordersArea');
    if (!orders.length) {
      el.innerHTML = `<div class="empty"><div class="ic">🧾</div>No orders yet<br><span style="font-size:13px">Your order history shows up here.</span></div>`;
      return;
    }
    el.innerHTML = orders.map(o => {
      const idx = STEPS.findIndex(s => s.key === o.state);
      const cancelled = o.state === 'CANCELLED';
      return `
      <div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>${o.orderId}</b>
          <span style="font-size:12px;color:var(--muted)">${o.slot}</span>
        </div>
        ${cancelled
          ? `<div style="color:var(--danger);font-weight:700;margin:10px 0">Cancelled</div>`
          : `<div class="progress-track">
               ${STEPS.map((s, i) => `
                 <div class="progress-step ${i < idx ? 'done' : ''} ${i === idx ? 'current' : ''}">
                   <div class="dot">${i < idx ? '✓' : s.icon}</div>
                   <div class="lbl">${s.label}</div>
                 </div>`).join('')}
             </div>`}
        <div style="margin-top:10px">
          ${o.items.map(it => `<div class="line-total"><span>${it.name} × ${it.quantity}</span><span>₹${it.unitPrice * it.quantity}</span></div>`).join('')}
          <div class="line-total grand"><span>Total</span><span>₹${o.total}</span></div>
        </div>
        ${!cancelled && o.state !== 'COLLECTED' ? `
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-outline danger" onclick="App.cancelOrder('${o.orderId}')">Cancel</button>
            <button class="btn btn-outline" onclick="App.advanceOrder('${o.orderId}')">Simulate: next step</button>
          </div>` : ''}
      </div>`;
    }).join('');
  }

  // ---------------- Profile ----------------
  function renderProfile() {
    document.getElementById('statStreak').textContent = streak;
    document.getElementById('statXp').textContent = xp;
    document.getElementById('statOrders').textContent = orders.filter(o => o.state === 'COLLECTED').length;
    document.getElementById('badgeRow').innerHTML = badges.map(b => `
      <div class="badge-pill" style="opacity:${b.earned ? 1 : .4}">${b.icon} ${b.label}</div>
    `).join('');
  }

  return { login, logout, show, setStall, changeQty, placeOrder, cancelOrder, advanceOrder };
})();
