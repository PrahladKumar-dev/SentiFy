

// Apply theme instantly before paint
(function () {
    const saved = localStorage.getItem("sentify_theme");
    if (saved === "dark") document.body.classList.add("dark");
})();

document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-toggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("sentify_theme");

    if (savedTheme === "dark") {
        body.classList.add("dark");
        if (themeBtn) themeBtn.textContent = "🌞";
    } else {
        body.classList.remove("dark");
        if (themeBtn) themeBtn.textContent = "🌙";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDark = body.classList.toggle("dark");
            localStorage.setItem("sentify_theme", isDark ? "dark" : "light");
            themeBtn.textContent = isDark ? "🌞" : "🌙";
        });
    }
});


/* =======================================================
   🛍️ E-COMMERCE LOGIC
======================================================= */

const USERS = "users_data";
const CURRENT_USER = "logged_user";
const PRODUCTS = "product_list";
const CART = "cart_items";

const cartCountBadge = document.getElementById("cart-badge");
const openCartBtn = document.getElementById("btn-cart");
const cartPanel = document.getElementById("cart-panel");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalAmount = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");
const shopNowBtn = document.getElementById("hero-shop");

const readStorage = (key) => JSON.parse(localStorage.getItem(key) || "null");
const saveStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

if (!readStorage(USERS)) saveStorage(USERS, []);
if (!readStorage(CART)) saveStorage(CART, {});


/* ---------- Add Default Products ---------- */
function addDefaultProducts() {
  const defaults = [
    // 👕 Men
    { id: "m1", name: "Men T-Shirt", price: 599, img: "https://images.unsplash.com/photo-1505632958218-4f23394784a6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764", category: "men" },
    { id: "m2", name: "Men Jacket", price: 1299, img: "https://plus.unsplash.com/premium_photo-1673734626655-0c1dc4be0e9c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "men" },
    { id: "m3", name: "Men Shirt", price: 899, img: "https://plus.unsplash.com/premium_photo-1661627681947-4431c8c97659?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
, category: "men" },
    { id: "m4", name: "Men Hoodie", price: 999, img: "https://images.unsplash.com/photo-1620911014470-a7b48583dcb4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "men" },
    { id: "m5", name: "Men goggles", price: 999, img: "https://images.unsplash.com/photo-1620911014470-a7b48583dcb4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "men" },

    // 👗 Women
    { id: "w1", name: "Women Dress", price: 1499, img: "https://images.unsplash.com/photo-1599662875272-64de8289f6d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "women" },
    { id: "w2", name: "Women Bag", price: 999, img: "https://images.unsplash.com/photo-1559563458-527698bf5295?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070", category: "women" },
    { id: "w3", name: "Women Top", price: 799, img: "https://plus.unsplash.com/premium_photo-1690350731538-57344931ac02?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170", category: "women" },
    { id: "w4", name: "Women Heels", price: 799, img: "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765", category: "women" },

    // 🧒 Kids
    { id: "k1", name: "Kids T-Shirt", price: 499, img: "https://plus.unsplash.com/premium_photo-1691367782367-2bd37f646abc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "kids" },
    { id: "k2", name: "Kids Shoes", price: 799, img: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170", category: "kids" },
    { id: "k3", name: "Kids Jacket", price: 899, img: "https://plus.unsplash.com/premium_photo-1707816501228-1d814ad62d7b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687", category: "kids" },
  ];

  const existing = readStorage(PRODUCTS) || [];
  const existingIds = new Set(existing.map(p => p.id));

  // ✅ Filter out duplicates (same id)
  const uniqueNewProducts = defaults.filter(p => !existingIds.has(p.id));

  // If there are any new unique products, merge them
  if (uniqueNewProducts.length > 0) {
    const updatedList = [...existing, ...uniqueNewProducts];
    saveStorage(PRODUCTS, updatedList);
    console.log("✅ New products added:", uniqueNewProducts);
  } else {
    console.log("ℹ️ No new unique products to add.");
  }
}
addDefaultProducts();



/* ---------- Display Products (Dynamic) ---------- */
function displayProducts() {
  const products = readStorage(PRODUCTS) || [];
  const page = window.location.pathname.split("/").pop().toLowerCase();

  // Section containers
  const menSection = document.getElementById("men-products");
  const womenSection = document.getElementById("women-products");
  const kidsSection = document.getElementById("kids-products");

  // Clear previous content
  if (menSection) menSection.innerHTML = "";
  if (womenSection) womenSection.innerHTML = "";
  if (kidsSection) kidsSection.innerHTML = "";

  // Card builder
  const createCard = (p) => {
    const card = document.createElement("div");
    card.className = "bg-white p-3 rounded-lg shadow hover:shadow-md transition product-card";
    card.innerHTML = `
      <img src="${p.img}" class="w-full h-60 object-cover object-center rounded-lg mb-3" />
      <h3 class="font-semibold">${p.name}</h3>
      <p class="text-sm text-gray-500">₹${p.price}</p>
      <div class="mt-3 flex gap-2">
        <input type="number" min="1" value="1" class="w-20 border rounded p-1" />
        <button class="add-to-cart flex-1 bg-red-600 text-white rounded p-2 hover:bg-red-700" data-id="${p.id}">
          Add to Cart
        </button>
      </div>`;
    return card;
  };

  // 🏠 HOME PAGE — show first 3 of each
  if (page === "" || page === "home.html" || page === "index.html") {
    const men = products.filter(p => p.category === "men").slice(0, 3);
    const women = products.filter(p => p.category === "women").slice(0, 3);
    const kids = products.filter(p => p.category === "kids").slice(0, 3);

    men.forEach(p => menSection?.appendChild(createCard(p)));
    women.forEach(p => womenSection?.appendChild(createCard(p)));
    kids.forEach(p => kidsSection?.appendChild(createCard(p)));
  }

  // 👕 MEN PAGE — show all men products
  else if (page.includes("men")) {
    const menProducts = products.filter(p => p.category === "men");
    menProducts.forEach(p => menSection?.appendChild(createCard(p)));
  }

  // 👗 WOMEN PAGE — show all women products
  else if (page.includes("women")) {
    const womenProducts = products.filter(p => p.category === "women");
    womenProducts.forEach(p => womenSection?.appendChild(createCard(p)));
  }

  // 🧒 KIDS PAGE — show all kids products
  else if (page.includes("kids")) {
    const kidsProducts = products.filter(p => p.category === "kids");
    kidsProducts.forEach(p => kidsSection?.appendChild(createCard(p)));
  }
}


/* ---------- Cart helpers ---------- */
function getCart() { return readStorage(CART) || {}; }
function saveCart(cart) { saveStorage(CART, cart); updateCartBadge(); }

function addToCart(productId, quantity = 1) {
    const currentUser = readStorage(CURRENT_USER);
    if (!currentUser) { showToast("⚠️ Please sign in to add items to your cart"); return false; }

    quantity = parseInt(quantity, 10) || 1;
    if (quantity <= 0) quantity = 1;

    const cart = getCart();
    if (!cart[currentUser.email]) cart[currentUser.email] = {};
    const userCart = cart[currentUser.email];

    userCart[productId] = (userCart[productId] || 0) + quantity;
    cart[currentUser.email] = userCart;

    saveCart(cart);
    renderCartItems();
    showToast("✅ Added to cart");
    return true;
}

function updateCartBadge() {
    const currentUser = readStorage(CURRENT_USER);
    const cart = getCart();
    cartCountBadge.textContent =
        currentUser && cart[currentUser.email]
            ? Object.keys(cart[currentUser.email]).length
            : 0;
}

/* ---------- Cart open/close ---------- */
function openCart() {
    const currentUser = readStorage(CURRENT_USER);
    if (!currentUser) return showToast("⚠️ Please sign in to view your cart");
    cartPanel.style.transform = "translateX(0)";
    renderCartItems();
}
function closeCart() { cartPanel.style.transform = "translateX(100%)"; }
openCartBtn?.addEventListener("click", openCart);
closeCartBtn?.addEventListener("click", closeCart);

/* ---------- Single delegated click listener ---------- */
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest(".product-card");
    const qtyInput = card?.querySelector('input[type="number"]');
    const qty = parseInt(qtyInput?.value || "1", 10);
    const productId = btn.dataset.id;
    addToCart(productId, qty);
});

/* ---------- Render cart ---------- */
function renderCartItems() {
    const currentUser = readStorage(CURRENT_USER);
    const cart = getCart();
    const products = readStorage(PRODUCTS) || [];
    cartItemsContainer.innerHTML = "";
    let total = 0;
    if (!currentUser) {
        cartItemsContainer.innerHTML = "<p class='text-gray-500'>Please sign in to view your cart.</p>";
        cartTotalAmount.textContent = "₹0.00";
        return;
    }
    const userCart = cart[currentUser.email] || {};
    if (Object.keys(userCart).length === 0) {
        cartItemsContainer.innerHTML = "<p class='text-gray-500'>Your cart is empty.</p>";
        cartTotalAmount.textContent = "₹0.00";
        return;
    }

    for (const [id, qty] of Object.entries(userCart)) {
        const p = products.find(x => x.id === id);
        if (!p) continue;
        const subtotal = p.price * qty;
        total += subtotal;
        const item = document.createElement("div");
        item.className = "flex items-center gap-3 border rounded p-2 mb-2";
        item.innerHTML = `
      <img src="${p.img}" class="w-16 h-16 object-cover rounded" />
      <div class="flex-1">
        <div class="font-medium">${p.name}</div>
        <div class="text-sm text-gray-500">₹${p.price} × ${qty} = ₹${subtotal}</div>
        <div class="mt-2 flex gap-2">
          <button class="decrease border rounded px-2">-</button>
          <span>${qty}</span>
          <button class="increase border rounded px-2">+</button>
          <button class="remove text-red-600 ml-3">Remove</button>
        </div>
      </div>`;
        cartItemsContainer.appendChild(item);

        item.querySelector(".decrease").addEventListener("click", () => {
            const updated = getCart();
            const uc = updated[currentUser.email];
            uc[id] = Math.max(uc[id] - 1, 0);
            if (uc[id] === 0) delete uc[id];
            updated[currentUser.email] = uc;
            saveCart(updated);
            renderCartItems();
        });

        item.querySelector(".increase").addEventListener("click", () => {
            const updated = getCart();
            const uc = updated[currentUser.email];
            uc[id] = (uc[id] || 0) + 1;
            updated[currentUser.email] = uc;
            saveCart(updated);
            renderCartItems();
        });

        item.querySelector(".remove").addEventListener("click", () => {
            const updated = getCart();
            const uc = updated[currentUser.email];
            delete uc[id];
            updated[currentUser.email] = uc;
            saveCart(updated);
            renderCartItems();
        });
    }
    cartTotalAmount.textContent = `₹${total.toFixed(2)}`;
}

/* ---------- Clear cart ---------- */
clearCartBtn?.addEventListener("click", () => {
    const currentUser = readStorage(CURRENT_USER);
    if (!currentUser) return showToast("⚠️ Please sign in first");
    const cart = getCart();
    cart[currentUser.email] = {};
    saveCart(cart);
    renderCartItems();
    showToast("🧹 Cart cleared");
});

/* ---------- Checkout ---------- */
checkoutBtn?.addEventListener("click", () => {
    const currentUser = readStorage(CURRENT_USER);
    if (!currentUser) return showToast("⚠️ Please sign in to place an order");
    const cart = getCart();
    const userCart = cart[currentUser.email] || {};
    if (Object.keys(userCart).length === 0) return showToast("Your cart is empty");
    cart[currentUser.email] = {};
    saveCart(cart);
    renderCartItems();
    showToast(`✅ Order placed successfully, ${currentUser.name}!`);
});

/* ---------- Toast helper ---------- */
function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.className = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
}

/* ---------- Init ---------- */
displayProducts();
updateCartBadge();
shopNowBtn?.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#men")?.scrollIntoView({ behavior: "smooth" });
});

/* =======================================================
   👤 SIGN IN / SIGN UP LOGIC
======================================================= */



const authForm = document.getElementById('auth-form');
const signUpBtn = document.getElementById('btn-signup');
const signInBtn = document.getElementById('btn-signin');
const authModal = document.getElementById('auth-modal');
const authTitle = document.getElementById('auth-title');
const closeAuthBtn = document.getElementById('auth-close');
const switchAuthLink = document.getElementById('switch-auth');
const nameInputField = document.getElementById('name-field');
const userDisplayArea = document.getElementById('user-area');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');

const name_error = document.getElementById('name_error');
const email_error = document.getElementById('email_error');
const pass_error = document.getElementById('pass_error');






/* ---------- REGEX PATTERNS ---------- */
const namePattern = /^[A-Za-z]+$/;
const emailPattern = /^(?!.*[A-Z])[a-z0-9._]+@gmail\.com$/;
const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;



/* =======================================================
   🧠 VALIDATION FUNCTION
   ======================================================= */


function validateField(input, pattern, errorEl, errorMsg) {
    const val = input.value.trim();

    if (val === "") {
        input.style.borderColor = "#cd2d00";
        errorEl.textContent = "*The field is empty*";
        errorEl.style.color = "red";
        errorEl.hidden = false;
        return false;
    }

    if (pattern.test(val)) {
        input.style.borderColor = "#2eb82e";
        errorEl.hidden = true;
        return true;
    } else {
        input.style.borderColor = "#cd2d00";
        errorEl.textContent = errorMsg;
        errorEl.style.color = "red";
        errorEl.hidden = false;
        return false;
    }
}


/* =======================================================
   🧩 FIELD VALIDATION EVENTS (focusout)
   ======================================================= */

nameInput.addEventListener("focusout", () => {
    validateField(nameInput, namePattern, name_error, "Enter valid name");
});

emailInput.addEventListener("focusout", () => {
    const valid = validateField(emailInput, emailPattern, email_error, "Email must be lowercase and end with @gmail.com");
    if (!valid) return;

    const storedUsers = JSON.parse(localStorage.getItem(USERS)) || [];
    const emailExists = storedUsers.some((u) => u.email === emailInput.value.trim());

    if (emailExists && isSignUpMode) {
        emailInput.style.borderColor = "#cd2d00";
        email_error.textContent = "Email already exists, use a different one";
        email_error.style.color = "red";
        email_error.hidden = false;
    } else if (!isSignUpMode && !emailExists) {
        // For sign-in: invalid email
        emailInput.style.borderColor = "#cd2d00";
        email_error.textContent = "No account found with this email";
        email_error.style.color = "red";
        email_error.hidden = false;
    } else {
        emailInput.style.borderColor = "#2eb82e";
        email_error.hidden = true;
    }
});

passInput.addEventListener("focusout", () => {
    validateField(passInput, passPattern, pass_error, "Password must be 8–12 chars, 1 capital, 1 number, 1 special char");
});


/* =======================================================
   🧱 AUTH MODAL OPEN/CLOSE
   ======================================================= */

let isSignUpMode = true;

function openAuth(signup = true) {
    isSignUpMode = signup;
    authTitle.textContent = signup ? "Sign Up" : "Sign In";
    switchAuthLink.textContent = signup
        ? "Already have an account? Sign In"
        : "New here? Sign Up";
    nameInputField.style.display = signup ? "block" : "none";
    authModal.classList.remove("hidden");
    authModal.classList.add("flex");
    clearAuthForm();
}

function closeAuth() {
    authModal.classList.add("hidden");
    clearAuthForm();
}

function clearAuthForm() {
    nameInput.value = "";
    emailInput.value = "";
    passInput.value = "";
    nameInput.style.borderColor = "";
    emailInput.style.borderColor = "";
    passInput.style.borderColor = "";
    name_error.hidden = true;
    email_error.hidden = true;
    pass_error.hidden = true;
}

/* ---------- Button Events ---------- */
signUpBtn.addEventListener("click", () => openAuth(true));
signInBtn.addEventListener("click", () => openAuth(false));
closeAuthBtn.addEventListener("click", closeAuth);
authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuth();
});
switchAuthLink.addEventListener("click", () => openAuth(!isSignUpMode));

/* =======================================================
   🔒 HANDLE FORM SUBMIT (SIGNUP / SIGNIN)
   ======================================================= */

authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const users = readStorage(USERS) || [];

    // --- SIGN UP MODE ---
    if (isSignUpMode) {
        const nameValid = validateField(nameInput, namePattern, name_error, "Enter valid name");
        const emailValid = validateField(emailInput, emailPattern, email_error, "Email must be lowercase and end with @gmail.com");
        const passValid = validateField(passInput, passPattern, pass_error, "Password must be 8–12 chars, 1 capital, 1 number, 1 special char");

        if (!nameValid || !emailValid || !passValid) return;

        const emailExists = users.some((u) => u.email === email);
        if (emailExists) {
            emailInput.style.borderColor = "#cd2d00";
            email_error.textContent = "Email already exists";
            email_error.hidden = false;
            return;
        }

        users.push({ name, email, password });
        saveStorage(USERS, users);
        showToast("✅ Account created! You can now sign in.");
        clearAuthForm();
        setTimeout(() => openAuth(false), 700);
    }

    // --- SIGN IN MODE ---
    else {
        const user = users.find((u) => u.email === email && u.password === password);

        if (!users.some((u) => u.email === email)) {
            // No email found
            emailInput.style.borderColor = "#cd2d00";
            email_error.textContent = "❌ No account found with this email";
            email_error.hidden = false;
            return;
        }

        if (!user) {
            // Email found but wrong password
            passInput.style.borderColor = "#cd2d00";
            pass_error.textContent = "❌ Incorrect password";
            pass_error.hidden = false;
            return;
        }

        // Success
        saveStorage(CURRENT_USER, user);
        updateUserArea();
        closeAuth();
        showToast(`👋 Welcome back, ${user.name}!`);
    }
});

/* =======================================================
   🧍‍♂️ UPDATE USER AREA
   ======================================================= */

function updateUserArea() {
    const user = readStorage(CURRENT_USER);
    if (user) {
        userDisplayArea.innerHTML = `
      Hello, <strong>${user.name}</strong>
      <button id="logout" class="ml-3 text-sm text-gray-300 hover:text-white">Logout</button>
    `;
        signInBtn.style.display = "none";
        signUpBtn.style.display = "none";

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem(CURRENT_USER);
            updateUserArea();
            showToast("👋 Logged out");
        });
    } else {
        userDisplayArea.innerHTML = "";
        signInBtn.style.display = "";
        signUpBtn.style.display = "";
    }
}

/* =======================================================
   🧍‍♂️ UPDATE USER AREA
======================================================= */
function updateUserArea() {
    const user = readStorage(CURRENT_USER);
    if (user) {
        userDisplayArea.innerHTML = `
      Hello, <strong>${user.name}</strong>
      <button id="logout" class="ml-3 text-sm text-gray-300 hover:text-white">Logout</button>
    `;
        signInBtn.style.display = "none";
        signUpBtn.style.display = "none";

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem(CURRENT_USER);
            updateUserArea();
            showToast("👋 Logged out");
            renderCartItems(); // clear view
            updateCartBadge();
        });
    } else {
        userDisplayArea.innerHTML = "";
        signInBtn.style.display = "";
        signUpBtn.style.display = "";
    }
}

/* =======================================================
   🚀 INIT APP (FINAL)
======================================================= */
updateUserArea();
renderCartItems();
updateCartBadge();

