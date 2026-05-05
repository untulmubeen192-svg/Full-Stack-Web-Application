function validateForm() {
  if (
    document.getElementById("name").value === "" ||
    document.getElementById("email").value === ""
  ) {
    alert("Please fill all fields");
    return false;
  }
  alert("Message sent successfully");
  return true;
}

const Cart = {
  items: JSON.parse(localStorage.getItem("glow_cart") || "[]"),

  save() {
    localStorage.setItem("glow_cart", JSON.stringify(this.items));
    this.updateBadge();
  },

  add(id, name, price) {
    const existing = this.items.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id, name, price, qty: 1 });
    }
    this.save();
    showToast(`${name} added to cart 🛍️`);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    renderCartModal();
  },

  updateQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.items = this.items.filter(i => i.id !== id);
    this.save();
    renderCartModal();
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const c = this.count();
      badge.textContent = c;
      badge.style.display = c > 0 ? "inline-flex" : "none";
    }
  }
};

/* ── TOAST NOTIFICATION ─────────────────────────────────────── */
function showToast(msg, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ── CART MODAL ─────────────────────────────────────────────── */
function openCart() {
  let modal = document.getElementById("cart-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cart-modal";
    modal.innerHTML = `
      <div class="cart-overlay" onclick="closeCart()"></div>
      <div class="cart-panel">
        <div class="cart-header">
          <h3>Your Cart</h3>
          <button class="cart-close" onclick="closeCart()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cart-body" id="cart-body"></div>
        <div class="cart-footer" id="cart-footer"></div>
      </div>`;
    document.body.appendChild(modal);
  }
  renderCartModal();
  modal.classList.add("open");
}

function closeCart() {
  const modal = document.getElementById("cart-modal");
  if (modal) modal.classList.remove("open");
}

function renderCartModal() {
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  if (!body || !footer) return;

  if (Cart.items.length === 0) {
    body.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>`;
    footer.innerHTML = "";
    return;
  }

  body.innerHTML = Cart.items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">PKR ${(item.price * item.qty).toLocaleString()}</span>
      </div>
      <div class="cart-item-controls">
        <button onclick="Cart.updateQty('${item.id}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="Cart.updateQty('${item.id}', 1)">+</button>
        <button class="cart-remove" onclick="Cart.remove('${item.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join("");

  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <strong>PKR ${Cart.total().toLocaleString()}</strong>
    </div>
    <button class="btn btn-full" onclick="checkout()">Checkout</button>
    <button class="btn btn-full" style="background:#25D366;margin-top:8px" onclick="checkoutViaWhatsApp()">
      <i class="fa-brands fa-whatsapp"></i> Order via WhatsApp
    </button>`;
}

function checkout() {
  showToast("Order placed! Thank you for shopping 💄", "success");
  Cart.items = [];
  Cart.save();
  renderCartModal();
  setTimeout(closeCart, 1500);
}

/* ── NAVBAR: CART BUTTON + MOBILE TOGGLE ────────────────────── */
function initNavbar() {
  const navFlex = document.querySelector(".nav-flex");
  const nav = document.querySelector(".nav-links");
  if (!nav || !navFlex) return;

  // Cart icon
  const cartBtn = document.createElement("button");
  cartBtn.className = "cart-btn";
  cartBtn.setAttribute("aria-label", "Open cart");
  cartBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i><span id="cart-badge" style="display:none">0</span>`;
  cartBtn.onclick = openCart;
  navFlex.appendChild(cartBtn);

  // Mobile hamburger
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.setAttribute("aria-label", "Toggle menu");
  hamburger.innerHTML = `<span></span><span></span><span></span>`;
  hamburger.onclick = () => {
    nav.classList.toggle("mobile-open");
    hamburger.classList.toggle("active");
  };
  navFlex.insertBefore(hamburger, cartBtn);

  Cart.updateBadge();

  // Set active link
  const current = location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll("a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === current);
  });
}

/* ── PRODUCT SEARCH & FILTER ────────────────────────────────── */
function initProducts() {
  const section = document.querySelector(".section");
  if (!section) return;
  const heading = section.querySelector("h2");
  if (!heading || heading.textContent.trim() !== "Makeup Collection") return;
  const grid = section.querySelector(".grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".card"));

  const controls = document.createElement("div");
  controls.className = "product-controls";
  controls.innerHTML = `
    <div class="search-wrap">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="product-search" placeholder="Search products…" autocomplete="off">
    </div>
    <div class="filter-chips" id="filter-chips">
      <button class="chip active" data-cat="all">All</button>
      <button class="chip" data-cat="face">Face</button>
      <button class="chip" data-cat="eyes">Eyes</button>
      <button class="chip" data-cat="lips">Lips</button>
      <button class="chip" data-cat="skin">Skincare</button>
    </div>`;
  grid.insertAdjacentElement("beforebegin", controls);

  const categoryMap = {
    face: ["Foundation","BB Cream","Concealer","Powder","Blush"],
    eyes: ["Eyeshadow","Mascara","Eyeliner","Brow Pencil","Lashes"],
    lips: ["Lipstick","Lip Gloss","Lip Balm","Lip Liner","Liquid Lipstick"],
    skin: ["Cleanser","Moisturizer","Serum","Sunscreen","Face Mask"]
  };

  cards.forEach((card, i) => {
    const name = card.querySelector("h4")?.textContent.trim() || "Product";
    const priceText = card.querySelector("span")?.textContent.replace(/[^0-9]/g, "") || "0";
    const price = parseInt(priceText);
    const id = `prod-${i}`;

    const btn = document.createElement("button");
    btn.className = "add-to-cart-btn";
    btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add to Cart`;
    btn.onclick = () => Cart.add(id, name, price);
    card.appendChild(btn);

    const cat = Object.entries(categoryMap).find(([, names]) => names.includes(name));
    card.dataset.cat = cat ? cat[0] : "other";
    card.dataset.name = name.toLowerCase();
  });

  let activeFilter = "all";
  let searchQuery = "";

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const matchCat = activeFilter === "all" || card.dataset.cat === activeFilter;
      const matchSearch = card.dataset.name.includes(searchQuery);
      const show = matchCat && matchSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    let empty = document.getElementById("products-empty");
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement("p");
        empty.id = "products-empty";
        empty.className = "products-empty";
        empty.textContent = "No products found. Try a different search or filter.";
        grid.insertAdjacentElement("afterend", empty);
      }
    } else if (empty) empty.remove();
  }

  document.getElementById("filter-chips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.cat;
    applyFilters();
  });

  document.getElementById("product-search").addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });
}

/* ── GALLERY LIGHTBOX ───────────────────────────────────────── */
function initGallery() {
  const imgs = document.querySelectorAll(".section .grid img");
  if (!imgs.length) return;

  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML = `
    <div class="lb-overlay" onclick="closeLightbox()"></div>
    <div class="lb-content">
      <button class="lb-close" onclick="closeLightbox()"><i class="fa-solid fa-xmark"></i></button>
      <button class="lb-prev" id="lb-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <img id="lb-img" src="" alt="Gallery image">
      <button class="lb-next" id="lb-next"><i class="fa-solid fa-chevron-right"></i></button>
      <span id="lb-counter"></span>
    </div>`;
  document.body.appendChild(lb);

  let currentIdx = 0;
  const allSrcs = Array.from(imgs).map(img => img.src);

  function openLightbox(idx) {
    currentIdx = idx;
    document.getElementById("lb-img").src = allSrcs[currentIdx];
    document.getElementById("lb-counter").textContent = `${currentIdx + 1} / ${allSrcs.length}`;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  window.closeLightbox = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.getElementById("lb-prev").onclick = (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + allSrcs.length) % allSrcs.length;
    openLightbox(currentIdx);
  };
  document.getElementById("lb-next").onclick = (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % allSrcs.length;
    openLightbox(currentIdx);
  };

  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "ArrowLeft") document.getElementById("lb-prev").click();
    if (e.key === "ArrowRight") document.getElementById("lb-next").click();
    if (e.key === "Escape") closeLightbox();
  });

  imgs.forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(i));
  });
}

/* ── CONTACT FORM VALIDATION ────────────────────────────────── */
function initContactForm() {
  const form = document.querySelector("form");
  if (!form) return;

  form.onsubmit = function (e) {
    e.preventDefault();
    const fields = {
      name: form.querySelector("#name") || form.querySelector("[name='name']"),
      email: form.querySelector("#email") || form.querySelector("[name='email']"),
      message: form.querySelector("textarea")
    };

    let valid = true;
    Object.entries(fields).forEach(([key, el]) => {
      if (!el) return;
      const val = el.value.trim();
      el.classList.remove("input-error");
      const errId = `err-${key}`;
      let errEl = document.getElementById(errId);
      if (!errEl) {
        errEl = document.createElement("span");
        errEl.id = errId;
        errEl.className = "field-error";
        el.insertAdjacentElement("afterend", errEl);
      }
      if (!val) {
        errEl.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
        el.classList.add("input-error");
        valid = false;
      } else if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errEl.textContent = "Please enter a valid email address.";
        el.classList.add("input-error");
        valid = false;
      } else {
        errEl.textContent = "";
      }
    });

    if (valid) {
      showToast("Message sent! We'll get back to you soon 💌", "success");
      form.reset();
    }
    return false;
  };
}

/* ── FEATURED PRODUCTS (HOME PAGE) ─────────────────────────── */
function initFeaturedProducts() {
  if (!document.querySelector(".hero")) return;
  const grid = document.querySelector(".section .grid");
  if (!grid) return;
  const cards = grid.querySelectorAll(".card");

  const productData = [
    { id: "feat-0", name: "Foundation", price: 4500 },
    { id: "feat-1", name: "Lipstick", price: 2200 },
    { id: "feat-2", name: "Eyeshadow", price: 5800 },
    { id: "feat-3", name: "Moisturizer", price: 3000 }
  ];

  cards.forEach((card, i) => {
    const data = productData[i];
    if (!data) return;
    const btn = document.createElement("button");
    btn.className = "add-to-cart-btn";
    btn.innerHTML = `<i class="fa-solid fa-plus"></i> Add to Cart`;
    btn.onclick = () => Cart.add(data.id, data.name, data.price);
    card.appendChild(btn);
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;
  const els = document.querySelectorAll(".card, .about-cards .card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach((el, i) => {
    el.classList.add("reveal-on-scroll");
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
}

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initProducts();
  initGallery();
  initContactForm();
  initFeaturedProducts();
  initScrollReveal();
});

function validateForm() { return true; }
/* ── WHATSAPP CART CHECKOUT ─────────────────────────────────── */
async function checkoutViaWhatsApp() {
  if (!Cart.items.length) { showToast("Your cart is empty", "error"); return; }
  try {
    const link = await WhatsAppAPI.cartLink(Cart.items);
    window.open(link, "_blank");
  } catch {
    const lines = Cart.items.map(i => `${i.name} x${i.qty} - PKR ${i.price * i.qty}`).join(", ");
    const msg = encodeURIComponent(`Hi! I'd like to order:\n${lines}\nTotal: PKR ${Cart.total()}`);
    window.open(`https://wa.me/923001234567?text=${msg}`, "_blank");
  }
}
