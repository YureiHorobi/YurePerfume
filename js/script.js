/* ============================================================
   YUREI.PERFUME — Main Script
   Handles: produk, keranjang, user, pencarian, kategori, feedback
   Versi: Gambar lokal dari folder images/
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPbA3LeRS2YLW0sGh1KGvlAj7nxtdWgPQ",
  authDomain: "yurei-perfume.firebaseapp.com",
  projectId: "yurei-perfume",
  storageBucket: "yurei-perfume.firebasestorage.app",
  messagingSenderId: "801480198785",
  appId: "1:801480198785:web:8081f90040a8dcb58c5b80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== DATA PRODUK DUMMY ===== */
// Ganti nama file gambar sesuai file yang kamu simpan di folder images/
const PRODUCTS = [
  {
    id: 1,
    name: "Sharaf Blend",
    brand: "Zimaya",
    category: "dubai",
    price: 415000,
    image: "js/sharaf.jpg",       // ← ganti nama file sesuai milikmu
    desc: "Aroma manis gourmand, hangat, dan intens, menonjolkan perpaduan dates (kurma), vanila, praline, dan sentuhan buzzy (seperti konyak) yang mewah.",
    volume: "100 ml",
    concentration: "Extrait De Parfum",
    longevity: "10–16 jam",
    sillage: "Sangat Kuat",
  },
  {
    id: 2,
    name: "Empire",
    brand: "Mykonos X RRQ",
    category: "lokal",
    price: 345000,
    image: "js/empire.jpg",
    desc: "Citrus yang kompleks, didominasi mandarin orange, bergamot, jahe, dan sentuhan coconut water. Wanginya memberikan kesan segar-pedas (spicy woody) yang tidak manis, energik, dan menenangkan, cocok untuk cuaca panas atau olahraga.",
    volume: "100 ml",
    concentration: "Extrait De parfum",
    longevity: "8–12 jam",
    sillage: "Kuat",
  },
  {
    id: 3,
    name: "Sauvage",
    brand: "Dior",
    category: "desainer",
    price: 2799000,
    image: "js/sauvage.jpg",
    desc: "Wanginya didominasi oleh perpaduan citrus (bergamot) yang segar, rempah-rempah pedas (lada), serta aroma woody dan ambroxan yang memberikan kesan bersih, mewah, dan tahan lama",
    volume: "100 ml",
    concentration: "EDP",
    longevity: "10–14 jam",
    sillage: "Sangat Kuat",
  },
  {
    id: 4,
    name: "9PM",
    brand: "Afnan",
    category: "dubai",
    price: 569000,
    image: "js/9pm.jpg",
    desc: "Didominasi aroma apple, cinnamon, dan vanilla yang menonjol, memberikan kesan maskulin, sensual, dan cocok untuk malam hari.",
    volume: "100 ml",
    concentration: "Eau De Parfum",
    longevity: "8–12 jam",
    sillage: "Kuat",
  },
  {
    id: 5,
    name: "Apollo",
    brand: "Velixir",
    category: "lokal",
    price: 369000,
    image: "js/apollo.jpg",
    desc: "Wanginya didominasi kesegaran apel hijau, jahe (ginger), dan bergamot di awal, lalu mengering menjadi aroma woody yang cozy. Sangat cocok untuk harian.",
    volume: "100 ml",
    concentration: "Eau De Parfum",
    longevity: "6–8 jam",
    sillage: "Sedang",
  },
  {
    id: 6,
    name: "Imagination",
    brand: "Louis Vuitton",
    category: "desainer",
    price: 7475000,
    image: "js/lv.jpg",
    desc: "memadukan jeruk sitrus tajam (bergamot, orange) dengan teh hitam, jahe, dan ambroxan, menciptakan kesan maskulin yang modern, energik, dan menenangkan. ",
    volume: "100 ml",
    concentration: "Eau De Parfum",
    longevity: "7–10 jam",
    sillage: "Sangat Kuat",
  },
  {
    id: 7,
    name: "Kaaf",
    brand: "Ahmed Al-Maghribi",
    category: "dubai",
    price: 465000,
    image: "js/kaaf.jpg",
    desc: "Segar, fresh-aquatic, dan buah-buahan yang dominan. Aromanya menenangkan, elegan, dan cocok untuk penggunaan sehari-hari, memberikan kesan ceria namun tetap sopan.",
    volume: "100 ml",
    concentration: "Extrait De Parfum",
    longevity: "8–12 jam",
    sillage: "Kuat",
  },
  {
    id: 8,
    name: "Bamboe Roencing",
    brand: "Project 1945",
    category: "lokal",
    price: 325000,
    image: "js/1945.jpg",
    desc: "Segar, clean, floral, dan sedikit manis. Aroma awalnya segar (bergamot, galbanum, marine), diikuti aroma bunga (osmanthus, jasmine, ylang-ylang), dan ditutup dengan aroma hangat (cedar wood, honey, musk).",
    volume: "100 ml",
    concentration: "Extrait De Parfum",
    longevity: "6–8 jam",
    sillage: "Sedang",
  },
];

/* ===== CATEGORY LABELS ===== */
const CAT_LABELS = {
  all:      { label: "Semua",           icon: "✦" },
  lokal:    { label: "Parfum Lokal",    icon: "🌿" },
  dubai:    { label: "Parfum Dubai",    icon: "🕌" },
  desainer: { label: "Parfum Desainer", icon: "💎" },
};

/* ===== HELPERS ===== */

/** Format angka ke format Rupiah */
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

/** Tampilkan toast notifikasi di pojok kanan bawah */
function showToast(msg, type = "success") {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(t);

  setTimeout(() => t.remove(), 3500);
}

/** Baca data dari localStorage dengan fallback jika kosong */
function lsGet(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

/** Simpan data ke localStorage */
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/**
 * Buat tag <img> untuk produk.
 * Jika gambar gagal dimuat (file tidak ada), otomatis tampilkan placeholder.
 * @param {string} src - path file gambar, misal "images/oud-mystic.jpg"
 * @param {string} alt - teks alternatif gambar
 * @param {string} cls - class CSS tambahan (opsional)
 */
function productImg(src, alt, cls = "") {
  return `<img
    src="${src}"
    alt="${alt}"
    class="prod-img ${cls}"
    onerror="this.onerror=null;this.src='images/placeholder.svg';this.style.opacity='.6';"
  />`;
}

/* ===== USER SYSTEM ===== */

/** Ambil user yang sedang login (null = guest) */
function getCurrentUser() {
  return lsGet("yureiCurrentUser", null);
}

/** Render info user di navbar / user-bar */
function renderUserUI() {
  const user     = getCurrentUser();
  const loginBtn = document.getElementById("navLoginBtn");
  const userBar  = document.getElementById("userBar");

  if (user) {
    if (loginBtn) loginBtn.classList.add("hidden");
    if (userBar) userBar.innerHTML = `
      👤 Halo, <strong>${user.name}</strong> &nbsp;|&nbsp;
      <a href="#" id="logoutLink" style="color:var(--accent);font-weight:500;">Logout</a>
    `;
  } else {
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (userBar) userBar.innerHTML = `
      👤 Mode <strong>Tamu</strong> &nbsp;|&nbsp;
      <a href="login.html" style="color:var(--accent);font-weight:500;">Login</a> untuk checkout
    `;
  }

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("yureiCurrentUser");
      showToast("Berhasil logout!", "info");
      setTimeout(() => location.reload(), 800);
    });
  }
}

/* ===== CART SYSTEM ===== */

function getCart()       { return lsGet("yureiCart", []); }
function saveCart(cart)  { lsSet("yureiCart", cart); }
function cartTotal()     { return getCart().reduce((s, i) => s + i.qty, 0); }

/** Update angka badge keranjang di navbar */
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = cartTotal();
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle("visible", count > 0);
}

/** Tambah produk ke keranjang */
function addToCart(productId, qty = 1) {
  const cart    = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const idx = cart.findIndex(i => i.id === productId);
  if (idx !== -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" ditambahkan ke keranjang 🛒`, "success");
}

window.addToCart = addToCart;

/** Ubah qty item di keranjang (qty <= 0 = hapus) */
function updateCartQty(productId, newQty) {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  } else {
    const idx = cart.findIndex(i => i.id === productId);
    if (idx !== -1) cart[idx].qty = newQty;
  }
  saveCart(cart);
  updateCartBadge();
}

/** Hapus satu item dari keranjang */
function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
  updateCartBadge();
}

/* ===== HAMBURGER MENU ===== */
function initHamburger() {
  const btn  = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileNav");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
}

/* ===== HOMEPAGE ===== */
function initHomepage() {
  if (!document.getElementById("productGrid")) return;

  let activeCategory = "all";
  let searchQuery    = "";

  function renderProducts() {
    const grid    = document.getElementById("productGrid");
    const countEl = document.getElementById("productCount");

    const filtered = PRODUCTS.filter(p => {
      const matchCat    = activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery) ||
        p.brand.toLowerCase().includes(searchQuery) ||
        p.desc.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (countEl) countEl.textContent = `${filtered.length} produk`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba kata kunci lain atau pilih kategori berbeda.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="product-card" onclick="goToDetail(${p.id})">
        <div class="product-img-wrap">
          ${productImg(p.image, p.name)}
          <span class="product-cat-badge">${CAT_LABELS[p.category].label}</span>
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-brand">${p.brand}</div>
          <div class="product-price">${formatRupiah(p.price)}</div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})">
              🛒 Keranjang
            </button>
            <button class="btn-detail" onclick="event.stopPropagation(); goToDetail(${p.id})">
              Detail
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  window.goToDetail = function(id) {
    window.location.href = `product.html?id=${id}`;
  };

  document.querySelectorAll(".cat-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      renderProducts();
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  document.getElementById("searchBtn")?.addEventListener("click", () => {
    searchQuery = searchInput?.value.toLowerCase().trim() || "";
    renderProducts();
  });

  renderProducts();
}

/* ===== PRODUCT DETAIL PAGE ===== */
function initProductDetail() {
  const wrap = document.getElementById("detailWrap");
  if (!wrap) return;

  const params  = new URLSearchParams(window.location.search);
  const id      = parseInt(params.get("id"));
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    wrap.innerHTML = `
      <div style="text-align:center;padding:80px">
        <h2>Produk tidak ditemukan</h2><br>
        <a href="index.html" class="btn btn-primary">Kembali</a>
      </div>`;
    return;
  }

  const bcName = document.getElementById("bcProductName");
  if (bcName) bcName.textContent = product.name;
  document.title = `${product.name} — Yurei.Perfume`;

  let qty = 1;

  wrap.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img-wrap">
        ${productImg(product.image, product.name, "detail-img")}
      </div>
      <div class="detail-info">
        <div class="detail-cat">
          ${CAT_LABELS[product.category].icon} ${CAT_LABELS[product.category].label}
        </div>
        <h1 class="detail-name">${product.name}</h1>
        <div class="detail-brand">${product.brand}</div>
        <div class="detail-price">${formatRupiah(product.price)}</div>
        <div class="detail-attrs">
          <div class="attr-item"><div class="attr-label">Volume</div><div class="attr-val">${product.volume}</div></div>
          <div class="attr-item"><div class="attr-label">Konsentrasi</div><div class="attr-val">${product.concentration}</div></div>
          <div class="attr-item"><div class="attr-label">Ketahanan</div><div class="attr-val">${product.longevity}</div></div>
          <div class="attr-item"><div class="attr-label">Sillage</div><div class="attr-val">${product.sillage}</div></div>
        </div>
        <div class="detail-desc">${product.desc}</div>
        <div class="qty-wrap">
          <span class="qty-label">Jumlah:</span>
          <div class="qty-ctrl">
            <button class="qty-btn" id="qtyMinus">−</button>
            <div class="qty-val" id="qtyVal">1</div>
            <button class="qty-btn" id="qtyPlus">+</button>
          </div>
        </div>
        <div class="detail-actions">
          <button class="btn btn-primary btn-full btn-lg" id="btnAddCart">
            🛒 Tambah ke Keranjang
          </button>
          <a href="index.html" class="btn btn-outline btn-full">← Kembali Belanja</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (qty > 1) { qty--; document.getElementById("qtyVal").textContent = qty; }
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty++;
    document.getElementById("qtyVal").textContent = qty;
  });
  document.getElementById("btnAddCart").addEventListener("click", () => {
    addToCart(product.id, qty);
  });
}

/* ===== CART PAGE ===== */
function initCartPage() {
  if (!document.getElementById("cartWrap")) return;

  function renderCart() {
    const cart    = getCart();
    const wrap    = document.getElementById("cartWrap");
    const summary = document.getElementById("cartSummary");

    if (cart.length === 0) {
      wrap.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h2>Keranjang kosong</h2>
          <p style="color:var(--text-light);margin-bottom:24px">Belum ada produk yang ditambahkan.</p>
          <a href="index.html" class="btn btn-primary">Mulai Belanja</a>
        </div>`;
      if (summary) summary.classList.add("hidden");
      return;
    }

    if (summary) summary.classList.remove("hidden");

    let subtotal = 0;
    const items = cart.map(ci => {
      const p = PRODUCTS.find(p => p.id === ci.id);
      if (!p) return "";
      const itemTotal = p.price * ci.qty;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            ${productImg(p.image, p.name, "cart-thumb")}
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-brand">${p.brand} · ${p.volume}</div>
            <div class="cart-item-price">${formatRupiah(p.price)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${p.id}, ${ci.qty - 1})">−</button>
            <div class="qty-val">${ci.qty}</div>
            <button class="qty-btn" onclick="changeQty(${p.id}, ${ci.qty + 1})">+</button>
          </div>
          <div class="cart-item-total">${formatRupiah(itemTotal)}</div>
          <button class="btn btn-danger btn-sm" onclick="removeItem(${p.id})">Hapus</button>
        </div>
      `;
    });

    wrap.innerHTML = `<div class="cart-list">${items.join("")}</div>`;

    const ongkir = 15000;
    const total  = subtotal + ongkir;
    if (summary) summary.innerHTML = `
      <div class="summary-title">Ringkasan Pesanan</div>
      <div class="summary-row"><span>Subtotal</span><span>${formatRupiah(subtotal)}</span></div>
      <div class="summary-row"><span>Ongkos Kirim</span><span>${formatRupiah(ongkir)}</span></div>
      <div class="summary-row total">
        <span>Total</span><span class="val">${formatRupiah(total)}</span>
      </div>
      <button class="btn btn-primary btn-full btn-lg" style="margin-top:20px" onclick="doCheckout()">
        Checkout →
      </button>
      <a href="index.html" class="btn btn-outline btn-full" style="margin-top:8px">← Lanjut Belanja</a>
    `;
  }

  window.changeQty = function(id, newQty) {
    updateCartQty(id, newQty);
    renderCart();
    updateCartBadge();
  };

  window.removeItem = function(id) {
    removeFromCart(id);
    renderCart();
    updateCartBadge();
    showToast("Produk dihapus dari keranjang", "info");
  };

  window.doCheckout = function() {
    const user = getCurrentUser();
    if (!user) {
      document.getElementById("checkoutModal").classList.add("open");
      return;
    }
    document.getElementById("successModal").classList.add("open");
    saveCart([]);
    updateCartBadge();
  };

  renderCart();
}

/* ===== LOGIN PAGE ===== */
function initLoginPage() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass  = document.getElementById("loginPass").value;
    const users = lsGet("yureiUsers", []);
    const user  = users.find(u => u.email === email && u.password === pass);

    if (!user) { showToast("Email atau password salah!", "error"); return; }

    lsSet("yureiCurrentUser", user);
    showToast(`Selamat datang, ${user.name}! 👋`, "success");
    setTimeout(() => window.location.href = "index.html", 800);
  });
}

/* ===== REGISTER PAGE ===== */
function initRegisterPage() {
  const regForm = document.getElementById("registerForm");
  if (!regForm) return;

  regForm.addEventListener("submit", e => {
    e.preventDefault();
    const name  = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass  = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;

    if (pass !== pass2) { showToast("Konfirmasi password tidak cocok!", "error"); return; }
    if (pass.length < 6) { showToast("Password minimal 6 karakter!", "error"); return; }

    const users = lsGet("yureiUsers", []);
    if (users.find(u => u.email === email)) { showToast("Email sudah terdaftar!", "error"); return; }

    const newUser = { name, email, password: pass };
    users.push(newUser);
    lsSet("yureiUsers", users);
    lsSet("yureiCurrentUser", newUser);

    showToast(`Akun berhasil dibuat, selamat datang ${name}! 🎉`, "success");
    setTimeout(() => window.location.href = "index.html", 900);
  });
}

/* ===== FEEDBACK PAGE ===== */
function initFeedbackPage() {
  const form = document.getElementById("feedbackForm");
  if (!form) return;

  const list = document.getElementById("feedbackList");

  // 🔥 AMBIL DATA REALTIME
  onSnapshot(collection(db, "komentar"), (snapshot) => {
    let html = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      html += `
        <div class="feedback-item">
          <div class="feedback-item-name">
            <div class="avatar">${data.nama.charAt(0).toUpperCase()}</div>
            ${data.nama}
          </div>
          <div class="feedback-item-msg">${data.pesan}</div>
        </div>
      `;
    });

    list.innerHTML = html || `<div class="feedback-empty">Belum ada ulasan 😊</div>`;
  });

  // 📩 KIRIM KOMENTAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("feedbackName").value.trim();
    const pesan = document.getElementById("feedbackMsg").value.trim();

    if (!nama || !pesan) {
      showToast("Isi nama dan pesan dulu!", "error");
      return;
    }

    await addDoc(collection(db, "komentar"), {
      nama: nama,
      pesan: pesan,
      waktu: new Date()
    });

    form.reset();
    showToast("Ulasan berhasil dikirim! 🎉", "success");
  });
}

/* ===== MODAL ===== */
function initModals() {
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-overlay").classList.remove("open");
    });
  });
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderUserUI();
  initHamburger();
  initHomepage();
  initProductDetail();
  initCartPage();
  initLoginPage();
  initRegisterPage();
  initFeedbackPage();
  initModals();
});
