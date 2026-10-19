/**
 * Smart Canteen Preordering System - Faculty Module Prototype
 * Implementation aligned strictly with UML Class Diagram Specification:
 * - User (Abstract) -> Teacher (Inheritance)
 * - Teacher owns Cart & CartItem
 * - Teacher places Order & OrderItem
 * - Order generates Payment & receives Notifications
 * - CanteenSystem manages authentications, menus, & notifications
 */

// ==========================================
// 1. DATA MODELS & STATE INITIALIZATION
// ==========================================

// Teacher Model (inherits User properties)
let currentTeacher = {
  userId: 4029,
  name: "Prof. Rajesh Sharma",
  email: "r.sharma@msrit.edu",
  phone: "+91 98765 43210",
  employeeId: "EMP-CSE-4029",
  department: "Computer Science & Engineering",
  walletBalance: 1450.00
};

// Available Food Items (Menu Collection)
const FOOD_ITEMS = [
  {
    itemId: 101,
    itemName: "Masala Dosa + Filter Coffee",
    category: "Faculty Combos",
    price: 95.00,
    availability: true,
    prepTime: "8-10 min",
    calories: "380 kcal",
    rating: 4.9,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80",
    description: "Golden crispy rice crepe filled with spiced potato masala, served with 2 chutneys, sambar & authentic South Indian filter coffee."
  },
  {
    itemId: 102,
    itemName: "Executive South Indian Thali",
    category: "Meals",
    price: 130.00,
    availability: true,
    prepTime: "12-15 min",
    calories: "650 kcal",
    rating: 4.8,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=500&q=80",
    description: "Complete meal with Rice, 2 Chapattis, Sambar, Rasam, Special Vegetable Curry, Curd, Papad & Payasam."
  },
  {
    itemId: 103,
    itemName: "Paneer Butter Masala Combo",
    category: "Meals",
    price: 160.00,
    availability: true,
    prepTime: "10-12 min",
    calories: "580 kcal",
    rating: 4.7,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=80",
    description: "Rich cottage cheese gravy served with 2 Butter Naans, Jeera Rice, and Fresh Green Salad."
  },
  {
    itemId: 104,
    itemName: "Idli Vada Combo",
    category: "Breakfast",
    price: 65.00,
    availability: true,
    prepTime: "5 min",
    calories: "290 kcal",
    rating: 4.6,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80",
    description: "Steamed fluffy rice cakes (2 pcs) and crispy lentil donut (1 pc) served with coconut chutney & hot sambar."
  },
  {
    itemId: 105,
    itemName: "Grilled Cheese & Corn Sandwich",
    category: "Snacks",
    price: 75.00,
    availability: true,
    prepTime: "7 min",
    calories: "320 kcal",
    rating: 4.5,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80",
    description: "Whole wheat toasted bread stuffed with sweet corn, mozzarella cheese, herbs and green chutney."
  },
  {
    itemId: 106,
    itemName: "Cold Coffee with Ice Cream",
    category: "Beverages",
    price: 60.00,
    availability: true,
    prepTime: "3 min",
    calories: "210 kcal",
    rating: 4.9,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80",
    description: "Thick creamy blended coffee topped with a scoop of chocolate vanilla ice cream."
  },
  {
    itemId: 107,
    itemName: "Fresh Green Salad & Sprouts",
    category: "Faculty Combos",
    price: 80.00,
    availability: true,
    prepTime: "5 min",
    calories: "140 kcal",
    rating: 4.8,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
    description: "Healthy mix of mung bean sprouts, cucumber, cherry tomatoes, olive oil dressing & lime juice."
  },
  {
    itemId: 108,
    itemName: "Special Badam Milk (Hot)",
    category: "Beverages",
    price: 45.00,
    availability: false, // Demo sold out item
    prepTime: "2 min",
    calories: "180 kcal",
    rating: 4.7,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    description: "Warm saffron almond milk garnished with crushed pistachios."
  }
];

// Active Faculty Cart State
let cart = {
  cartId: 9001,
  items: [], // Array of CartItem { foodItem, quantity, subTotal }
  totalAmount: 0.0,
  pickupSlot: "Immediate (10-15 mins)"
};

// Orders Collection State
let ordersHistory = [
  {
    orderId: 90810,
    orderDate: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
    totalAmount: 160.00,
    status: "COLLECTED",
    pickupSlot: "Morning Break (11:00 AM)",
    items: [
      { itemId: 101, itemName: "Masala Dosa + Filter Coffee", quantity: 1, price: 95.00 },
      { itemId: 104, itemName: "Idli Vada Combo", quantity: 1, price: 65.00 }
    ],
    payment: {
      paymentId: "PAY-78219",
      amount: 160.00,
      paymentMode: "Wallet",
      paymentStatus: "SUCCESS",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    token: "#FAC-7821"
  }
];

// System Notifications Array
let notifications = [
  {
    notificationId: 1,
    message: "Welcome to Faculty Canteen Express Portal! 5% discount applied automatically.",
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  },
  {
    notificationId: 2,
    message: "Your yesterday's order #ORD-90810 was successfully picked up at Counter #3.",
    createdAt: "Yesterday 11:15 AM",
    read: true
  }
];

let selectedCategoryFilter = "All";
let activeTab = "menu";

// ==========================================
// 2. INITIALIZATION & NAVIGATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  renderHeaderWallet();
  renderMenu();
  renderCart();
  renderNotifications();
  lucide.createIcons();
});

function navigateTo(tabName) {
  activeTab = tabName;
  
  // Hide all tabs
  document.getElementById("tab-menu").classList.add("hidden");
  document.getElementById("tab-orders").classList.add("hidden");
  document.getElementById("tab-profile").classList.add("hidden");

  // Reset button styles
  const btnMenu = document.getElementById("nav-menu");
  const btnOrders = document.getElementById("nav-orders");
  const btnProfile = document.getElementById("nav-profile");

  [btnMenu, btnOrders, btnProfile].forEach(btn => {
    btn.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/60";
  });

  // Activate selected tab
  if (tabName === "menu") {
    document.getElementById("tab-menu").classList.remove("hidden");
    btnMenu.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-faculty-700 bg-white shadow-sm";
  } else if (tabName === "orders") {
    document.getElementById("tab-orders").classList.remove("hidden");
    btnOrders.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-faculty-700 bg-white shadow-sm";
    renderOrders();
  } else if (tabName === "profile") {
    document.getElementById("tab-profile").classList.remove("hidden");
    btnProfile.className = "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-faculty-700 bg-white shadow-sm";
    renderProfileDetails();
  }
}

// ==========================================
// 3. MENU DISPLAY & FILTERING (viewMenu)
// ==========================================

function filterCategory(catName) {
  selectedCategoryFilter = catName;
  
  // Highlight active category pill
  const buttons = document.querySelectorAll(".cat-btn");
  buttons.forEach(btn => {
    if (btn.innerText.includes(catName) || (catName === "All" && btn.innerText.includes("All Items"))) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderMenu();
}

function handleMenuFilter() {
  renderMenu();
}

function renderMenu() {
  const grid = document.getElementById("menu-grid");
  const searchQuery = document.getElementById("menu-search-input").value.toLowerCase();
  const availableOnly = document.getElementById("toggle-available-only").checked;

  let filtered = FOOD_ITEMS.filter(item => {
    const matchesCategory = (selectedCategoryFilter === "All") || (item.category === selectedCategoryFilter);
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery) || item.description.toLowerCase().includes(searchQuery);
    const matchesAvailability = availableOnly ? item.availability : true;
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  document.getElementById("item-count-display").innerText = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
        <i data-lucide="utensils" class="w-12 h-12 text-slate-300 mx-auto"></i>
        <h3 class="font-display font-bold text-lg text-slate-800">No food items found</h3>
        <p class="text-sm text-slate-500">Try changing your search term or category filters.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const cartQty = getItemQuantityInCart(item.itemId);
    
    return `
      <div class="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
        
        <!-- Image & Badges -->
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${item.image}" alt="${item.itemName}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
              <span class="w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}"></span>
              ${item.category}
            </span>
            ${item.category === 'Faculty Combos' ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase">Express Pick</span>` : ''}
          </div>

          <div class="absolute top-3 right-3">
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-md flex items-center gap-1">
              <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500 fill-amber-400"></i> ${item.rating}
            </span>
          </div>

          ${!item.availability ? `
            <div class="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm tracking-wider uppercase">
              <span class="px-4 py-2 rounded-2xl bg-rose-600/90 border border-rose-400">Currently Sold Out</span>
            </div>
          ` : ''}
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-1.5">
            <div class="flex justify-between items-start gap-2">
              <h3 class="font-display font-bold text-base text-slate-900 group-hover:text-faculty-700 transition leading-snug">${item.itemName}</h3>
            </div>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">${item.description}</p>
          </div>

          <!-- Metadata Pill (Prep Time & Calories) -->
          <div class="flex items-center gap-3 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5 text-faculty-600"></i> ${item.prepTime}</span>
            <span>•</span>
            <span class="flex items-center gap-1"><i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500"></i> ${item.calories}</span>
          </div>

          <!-- Price & Action Button -->
          <div class="flex items-center justify-between pt-2">
            <div>
              <span class="text-[10px] text-slate-400 block font-semibold">Faculty Price</span>
              <span class="font-display font-extrabold text-xl text-slate-900">₹${item.price.toFixed(2)}</span>
            </div>

            ${item.availability ? (
              cartQty > 0 ? `
                <div class="flex items-center bg-faculty-600 text-white rounded-2xl p-1 shadow-md shadow-faculty-600/30">
                  <button onclick="updateCartQuantity(${item.itemId}, ${cartQty - 1})" class="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-faculty-700 rounded-xl transition">-</button>
                  <span class="w-8 text-center font-bold text-sm">${cartQty}</span>
                  <button onclick="updateCartQuantity(${item.itemId}, ${cartQty + 1})" class="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-faculty-700 rounded-xl transition">+</button>
                </div>
              ` : `
                <button onclick="addToCart(${item.itemId})" class="px-4 py-2.5 rounded-2xl bg-faculty-50 hover:bg-faculty-600 text-faculty-700 hover:text-white font-bold text-xs border border-faculty-200 hover:border-faculty-600 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5">
                  <i data-lucide="plus" class="w-4 h-4"></i> Add to Cart
                </button>
              `
            ) : `
              <button disabled class="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200 cursor-not-allowed">
                Unavailable
              </button>
            `}
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function getItemQuantityInCart(itemId) {
  const found = cart.items.find(ci => ci.foodItem.itemId === itemId);
  return found ? found.quantity : 0;
}

// ==========================================
// 4. CART & CART ITEM OPERATIONS (Cart)
// ==========================================

function addToCart(itemId) {
  const item = FOOD_ITEMS.find(i => i.itemId === itemId);
  if (!item || !item.availability) return;

  const existing = cart.items.find(ci => ci.foodItem.itemId === itemId);
  if (existing) {
    existing.quantity += 1;
    existing.subTotal = existing.quantity * item.price;
  } else {
    cart.items.push({
      foodItem: item,
      quantity: 1,
      subTotal: item.price
    });
  }

  calculateCartTotal();
  renderMenu();
  renderCart();
  
  // Show brief feedback toast
  addNotification(`Added "${item.itemName}" to your cart.`);
}

function updateCartQuantity(itemId, newQty) {
  if (newQty <= 0) {
    cart.items = cart.items.filter(ci => ci.foodItem.itemId !== itemId);
  } else {
    const found = cart.items.find(ci => ci.foodItem.itemId === itemId);
    if (found) {
      found.quantity = newQty;
      found.subTotal = newQty * found.foodItem.price;
    }
  }

  calculateCartTotal();
  renderMenu();
  renderCart();
}

function calculateCartTotal() {
  const subtotal = cart.items.reduce((acc, ci) => acc + ci.subTotal, 0);
  const discount = subtotal * 0.05; // 5% Faculty perk
  const tax = subtotal * 0.02; // 2% handling
  
  cart.totalAmount = Math.max(0, subtotal - discount + tax);

  document.getElementById("cart-subtotal").innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById("cart-discount").innerText = `-₹${discount.toFixed(2)}`;
  document.getElementById("cart-tax").innerText = `₹${tax.toFixed(2)}`;
  document.getElementById("cart-total").innerText = `₹${cart.totalAmount.toFixed(2)}`;
  document.getElementById("cart-header-total").innerText = `₹${cart.totalAmount.toFixed(2)}`;

  const totalItemCount = cart.items.reduce((acc, ci) => acc + ci.quantity, 0);
  document.getElementById("cart-badge").innerText = totalItemCount;
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  
  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center space-y-3">
        <i data-lucide="shopping-bag" class="w-16 h-16 text-slate-200 mx-auto"></i>
        <h4 class="font-display font-bold text-base text-slate-700">Your faculty cart is empty</h4>
        <p class="text-xs text-slate-400">Add delicious meals or breakfast combos to proceed.</p>
      </div>
    `;
    document.getElementById("btn-place-order").disabled = true;
    document.getElementById("btn-place-order").classList.add("opacity-50", "cursor-not-allowed");
    lucide.createIcons();
    return;
  }

  document.getElementById("btn-place-order").disabled = false;
  document.getElementById("btn-place-order").classList.remove("opacity-50", "cursor-not-allowed");

  container.innerHTML = cart.items.map(ci => `
    <div class="flex items-center justify-between py-3 gap-3">
      <img src="${ci.foodItem.image}" alt="${ci.foodItem.itemName}" class="w-14 h-14 rounded-2xl object-cover border border-slate-200">
      
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-xs text-slate-900 truncate">${ci.foodItem.itemName}</h4>
        <span class="text-xs text-slate-500 block">₹${ci.foodItem.price.toFixed(2)} × ${ci.quantity}</span>
        <span class="font-display font-bold text-sm text-faculty-700">Subtotal: ₹${ci.subTotal.toFixed(2)}</span>
      </div>

      <div class="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
        <button onclick="updateCartQuantity(${ci.foodItem.itemId}, ${ci.quantity - 1})" class="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition">-</button>
        <span class="w-6 text-center font-bold text-xs">${ci.quantity}</span>
        <button onclick="updateCartQuantity(${ci.foodItem.itemId}, ${ci.quantity + 1})" class="w-6 h-6 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition">+</button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function toggleCartDrawer() {
  const overlay = document.getElementById("cart-drawer-overlay");
  const drawer = document.getElementById("cart-drawer");

  if (drawer.classList.contains("translate-x-full")) {
    overlay.classList.remove("hidden");
    drawer.classList.remove("translate-x-full");
  } else {
    overlay.classList.add("hidden");
    drawer.classList.add("translate-x-full");
  }
}

// ==========================================
// 5. CHECKOUT & ORDER CREATION (Order & Payment)
// ==========================================

function processCheckout() {
  if (cart.items.length === 0) return;

  const paymentMode = document.querySelector('input[name="payment-mode"]:checked').value;
  const pickupSlot = document.getElementById("pickup-slot-select").value;

  // Check wallet balance if payment mode is Wallet
  if (paymentMode === "Wallet") {
    if (currentTeacher.walletBalance < cart.totalAmount) {
      alert(`Insufficient Wallet Balance! Required: ₹${cart.totalAmount.toFixed(2)}, Available: ₹${currentTeacher.walletBalance.toFixed(2)}. Please top up your wallet.`);
      openWalletModal();
      return;
    }
    // Deduct Wallet
    currentTeacher.walletBalance -= cart.totalAmount;
    renderHeaderWallet();
  }

  // Create New Order Object (Class Diagram Order)
  const newOrderId = Math.floor(10000 + Math.random() * 90000);
  const tokenStr = `#FAC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    orderId: newOrderId,
    orderDate: new Date().toISOString(),
    totalAmount: cart.totalAmount,
    status: "PREPARING", // Immediately queued for faculty priority!
    pickupSlot: pickupSlot,
    items: cart.items.map(ci => ({
      itemId: ci.foodItem.itemId,
      itemName: ci.foodItem.itemName,
      quantity: ci.quantity,
      price: ci.foodItem.price
    })),
    payment: {
      paymentId: `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: cart.totalAmount,
      paymentMode: paymentMode,
      paymentStatus: paymentMode === "Counter" ? "PENDING" : "SUCCESS",
      timestamp: new Date().toISOString()
    },
    token: tokenStr
  };

  ordersHistory.unshift(newOrder);

  // Clear Cart
  cart.items = [];
  calculateCartTotal();
  renderMenu();
  renderCart();
  toggleCartDrawer();

  // Show Confetti & Open Printable Receipt Modal
  try {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  } catch (e) {}

  addNotification(`Order #${newOrder.orderId} placed successfully! Digital Token: ${tokenStr}`);
  openReceiptModal(newOrder);
}

// ==========================================
// 6. ORDER HISTORY, TRACKING & CANCELLATION (Teacher)
// ==========================================

function renderOrders() {
  const container = document.getElementById("orders-container");
  const badge = document.getElementById("active-orders-badge");

  const activeCount = ordersHistory.filter(o => o.status === "PREPARING" || o.status === "READY" || o.status === "ACCEPTED").length;
  if (activeCount > 0) {
    badge.innerText = activeCount;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  if (ordersHistory.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
        <i data-lucide="clock" class="w-12 h-12 text-slate-300 mx-auto"></i>
        <h3 class="font-display font-bold text-lg text-slate-800">No previous orders</h3>
        <p class="text-sm text-slate-500">Your placed canteen orders will appear here for live tracking.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = ordersHistory.map(order => {
    const isPreparing = order.status === "PREPARING";
    const isReady = order.status === "READY";
    const isCollected = order.status === "COLLECTED";
    const isCancelled = order.status === "CANCELLED";

    return `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        <!-- Order Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-academic-800 text-white flex items-center justify-center font-display font-extrabold text-base">
              ${order.token}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display font-bold text-lg text-slate-900">Order #${order.orderId}</h3>
                <span class="status-badge-${order.status} px-3 py-0.5 rounded-full text-xs font-bold">${order.status}</span>
              </div>
              <span class="text-xs text-slate-400">Placed on ${new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Pickup: <strong class="text-slate-700">${order.pickupSlot}</strong></span>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            ${(isPreparing || order.status === "ACCEPTED") ? `
              <button onclick="cancelOrder(${order.orderId})" class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition">
                Cancel Order
              </button>
            ` : ''}
            
            <button onclick='openReceiptModal(${JSON.stringify(order)})' class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center gap-1.5">
              <i data-lucide="qr-code" class="w-4 h-4"></i> View Token QR
            </button>
            
            <button onclick="reorderPrevious(${order.orderId})" class="px-3.5 py-2 rounded-xl bg-faculty-600 hover:bg-faculty-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5">
              <i data-lucide="rotate-cw" class="w-4 h-4"></i> Re-Order
            </button>
          </div>
        </div>

        <!-- Order Progress Bar Tracker -->
        ${!isCancelled ? `
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold text-slate-500">
              <span class="${order.status === 'ACCEPTED' ? 'text-faculty-700' : ''}">1. Accepted</span>
              <span class="${isPreparing ? 'text-faculty-700 font-extrabold' : ''}">2. Preparing Kitchen</span>
              <span class="${isReady ? 'text-emerald-600 font-extrabold' : ''}">3. Ready at Counter #3</span>
              <span class="${isCollected ? 'text-slate-400' : ''}">4. Handed Over</span>
            </div>
            
            <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div class="h-full rounded-full transition-all duration-700 ${
                isCollected ? 'w-full bg-slate-400' :
                isReady ? 'w-3/4 bg-emerald-500 animate-pulse' :
                isPreparing ? 'w-1/2 bg-amber-500' : 'w-1/4 bg-faculty-600'
              }"></div>
            </div>

            <!-- Simulation Controls for Demo -->
            ${(isPreparing || isReady) ? `
              <div class="flex justify-end items-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>[Demo Staff Simulator]:</span>
                ${isPreparing ? `
                  <button onclick="simulateOrderState(${order.orderId}, 'READY')" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-semibold border border-amber-300">Mark as READY</button>
                ` : ''}
                ${isReady ? `
                  <button onclick="simulateOrderState(${order.orderId}, 'COLLECTED')" class="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-md font-semibold border border-emerald-300">Mark as COLLECTED</button>
                ` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Items Breakdown -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div class="font-bold text-slate-700 mb-1">Ordered Items:</div>
          <div class="divide-y divide-slate-200/60">
            ${order.items.map(it => `
              <div class="flex justify-between py-1.5 text-slate-700">
                <span>${it.itemName} × <strong>${it.quantity}</strong></span>
                <span class="font-semibold">₹${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Paid (${order.payment.paymentMode})</span>
            <span class="text-faculty-700 font-display text-base">₹${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function cancelOrder(orderId) {
  const order = ordersHistory.find(o => o.orderId === orderId);
  if (!order) return;

  if (confirm(`Are you sure you want to cancel Order #${orderId}? Your wallet will be refunded immediately.`)) {
    order.status = "CANCELLED";

    // Refund to wallet if paid via Wallet
    if (order.payment.paymentMode === "Wallet" && order.payment.paymentStatus === "SUCCESS") {
      currentTeacher.walletBalance += order.totalAmount;
      order.payment.paymentStatus = "REFUNDED";
      renderHeaderWallet();
      addNotification(`Order #${orderId} cancelled. ₹${order.totalAmount.toFixed(2)} refunded to your wallet.`);
    } else {
      addNotification(`Order #${orderId} has been cancelled.`);
    }

    renderOrders();
  }
}

function reorderPrevious(orderId) {
  const order = ordersHistory.find(o => o.orderId === orderId);
  if (!order) return;

  cart.items = [];
  order.items.forEach(it => {
    const foodItem = FOOD_ITEMS.find(f => f.itemId === it.itemId);
    if (foodItem && foodItem.availability) {
      cart.items.push({
        foodItem: foodItem,
        quantity: it.quantity,
        subTotal: foodItem.price * it.quantity
      });
    }
  });

  calculateCartTotal();
  renderMenu();
  renderCart();
  toggleCartDrawer();
  addNotification(`Loaded items from Order #${orderId} into cart.`);
}

function simulateOrderState(orderId, newState) {
  const order = ordersHistory.find(o => o.orderId === orderId);
  if (order) {
    order.status = newState;
    renderOrders();

    if (newState === "READY") {
      addNotification(`🎉 Your Order #${orderId} (${order.token}) is READY at Faculty Counter #3!`);
    } else if (newState === "COLLECTED") {
      addNotification(`Order #${orderId} marked as COLLECTED. Thank you!`);
    }
  }
}

// ==========================================
// 7. FACULTY WALLET OPERATIONS
// ==========================================

function openWalletModal() {
  document.getElementById("modal-wallet-balance").innerText = `₹${currentTeacher.walletBalance.toFixed(2)}`;
  document.getElementById("wallet-modal").classList.remove("hidden");
}

function closeWalletModal() {
  document.getElementById("wallet-modal").classList.add("hidden");
}

function selectTopUpAmount(amt) {
  document.getElementById("custom-topup-input").value = amt;
}

function executeWalletTopUp() {
  const input = document.getElementById("custom-topup-input");
  const amt = parseFloat(input.value);

  if (isNaN(amt) || amt <= 0) {
    alert("Please enter a valid amount to top up.");
    return;
  }

  currentTeacher.walletBalance += amt;
  renderHeaderWallet();
  closeWalletModal();
  addNotification(`Successfully topped up ₹${amt.toFixed(2)} into your Faculty Wallet!`);
  
  if (activeTab === "profile") {
    renderProfileDetails();
  }
}

function renderHeaderWallet() {
  document.getElementById("header-wallet-balance").innerText = `₹${currentTeacher.walletBalance.toFixed(2)}`;
  document.getElementById("profile-wallet-val").innerText = `₹${currentTeacher.walletBalance.toFixed(2)}`;
  document.getElementById("modal-wallet-balance").innerText = `₹${currentTeacher.walletBalance.toFixed(2)}`;
}

// ==========================================
// 8. RECEIPT & DIGITAL TOKEN MODAL
// ==========================================

function openReceiptModal(order) {
  document.getElementById("receipt-token-id").innerText = order.token;
  document.getElementById("receipt-order-id").innerText = `#ORD-${order.orderId}`;
  document.getElementById("receipt-faculty-name").innerText = currentTeacher.name;
  document.getElementById("receipt-faculty-dept").innerText = currentTeacher.department;
  document.getElementById("receipt-slot").innerText = order.pickupSlot;
  document.getElementById("receipt-payment-status").innerText = `${order.payment.paymentStatus} (${order.payment.paymentMode})`;
  document.getElementById("receipt-total-paid").innerText = `₹${order.totalAmount.toFixed(2)}`;

  // Render items list
  const container = document.getElementById("receipt-items-list");
  container.innerHTML = order.items.map(it => `
    <div class="flex justify-between py-1.5 text-slate-700">
      <span>${it.itemName} × <strong>${it.quantity}</strong></span>
      <span class="font-semibold">₹${(it.price * it.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  // Generate QR Code
  const qrContainer = document.getElementById("qrcode-canvas");
  qrContainer.innerHTML = "";
  try {
    new QRCode(qrContainer, {
      text: `CANTEEN-VERIFY:${order.orderId}:${order.token}:${currentTeacher.employeeId}`,
      width: 120,
      height: 120,
      colorDark : "#0f172a",
      colorLight : "#ffffff"
    });
  } catch (e) {}

  document.getElementById("receipt-modal").classList.remove("hidden");
  lucide.createIcons();
}

function closeReceiptModal() {
  document.getElementById("receipt-modal").classList.add("hidden");
}

// ==========================================
// 9. NOTIFICATION CENTER
// ==========================================

function toggleNotificationDrawer() {
  const drawer = document.getElementById("notification-drawer");
  drawer.classList.toggle("hidden");
}

function addNotification(msg) {
  const notif = {
    notificationId: Date.now(),
    message: msg,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  };
  notifications.unshift(notif);
  renderNotifications();
}

function markAllNotificationsRead() {
  notifications.forEach(n => n.read = true);
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById("notification-list");
  const badge = document.getElementById("notif-badge");

  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount > 0) {
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  list.innerHTML = notifications.map(n => `
    <div class="p-3 hover:bg-slate-50 transition rounded-xl flex items-start gap-3 ${!n.read ? 'bg-sky-50/50' : ''}">
      <div class="w-2 h-2 rounded-full mt-2 ${!n.read ? 'bg-sky-500' : 'bg-slate-300'}"></div>
      <div class="flex-1">
        <p class="text-xs text-slate-800 font-medium leading-relaxed">${n.message}</p>
        <span class="text-[10px] text-slate-400 mt-1 block">${n.createdAt}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 10. PROFILE TAB DISPLAY
// ==========================================

function renderProfileDetails() {
  document.getElementById("profile-full-name").innerText = currentTeacher.name;
  document.getElementById("profile-dept-name").innerText = `Faculty Member, ${currentTeacher.department}`;
  document.getElementById("faculty-dept-badge").innerText = currentTeacher.department;
  document.getElementById("faculty-greeting-name").innerText = currentTeacher.name;
  document.getElementById("faculty-emp-id").innerText = currentTeacher.employeeId;
  document.getElementById("profile-emp-id-val").innerText = currentTeacher.employeeId;
  document.getElementById("profile-wallet-val").innerText = `₹${currentTeacher.walletBalance.toFixed(2)}`;
}
