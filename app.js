/**
 * IQBAL SONS JEWELLERS — HAUTE JOAILLERIE & BESPOKE ATELIER
 * Complete E-Commerce Application Logic
 * State management, Currency switcher, Bespoke Ring Configurator, Cart, Wishlist & Modals
 */

(function () {
  "use strict";

  // Global State
  const AppState = {
    currency: localStorage.getItem("iqbal_currency") || "USD",
    cart: JSON.parse(localStorage.getItem("iqbal_cart")) || [],
    wishlist: JSON.parse(localStorage.getItem("iqbal_wishlist")) || [],
    activeFilter: "all",
    productSelectedMetals: {}, // Maps prodId -> selected metalCode
    atelier: {
      settingId: "solitaire",
      metalCode: "PT950",
      cutId: "round",
      carat: 2.00
    }
  };

  // DOM Elements cache
  const DOM = {};

  function initDOMElements() {
    DOM.header = document.getElementById("luxury-header");
    DOM.video = document.getElementById("hero-jewelry-video");
    DOM.currencySelect = document.getElementById("currency-select");
    DOM.filterBar = document.getElementById("collection-filter-bar");
    DOM.catalogGrid = document.getElementById("product-catalog-grid");
    DOM.cartPillBtn = document.getElementById("cart-pill-btn");
    DOM.cartCountBadge = document.getElementById("cart-count-badge");
    DOM.wishlistCountBadge = document.getElementById("wishlist-count-badge");
    DOM.cartDrawer = document.getElementById("cart-slide-drawer");
    DOM.cartBackdrop = document.getElementById("cart-drawer-backdrop");
    DOM.cartItemsList = document.getElementById("cart-items-list");
    DOM.cartSubtotal = document.getElementById("cart-subtotal-val");
    DOM.cartDrawerCount = document.getElementById("cart-drawer-count");
    DOM.wishlistDrawer = document.getElementById("wishlist-slide-drawer");
    DOM.wishlistBackdrop = document.getElementById("wishlist-drawer-backdrop");
    DOM.wishlistItemsList = document.getElementById("wishlist-items-list");
    DOM.wishlistDrawerCount = document.getElementById("wishlist-drawer-count");
    DOM.mobileDrawer = document.getElementById("mobile-drawer");
    DOM.mobileOverlay = document.getElementById("mobile-drawer-overlay");
    DOM.quickviewModal = document.getElementById("quickview-modal");
    DOM.quickviewContent = document.getElementById("quickview-content");
    DOM.atelierModal = document.getElementById("atelier-modal");
    DOM.toastContainer = document.getElementById("toast-container");
    DOM.heritagePillarsGrid = document.getElementById("heritage-pillars-grid");

    // Atelier Customizer Elements
    DOM.settingPillsContainer = document.getElementById("setting-pills-container");
    DOM.metalSwatchesContainer = document.getElementById("metal-swatches-container");
    DOM.diamondCutsContainer = document.getElementById("diamond-cuts-container");
    DOM.caratSlider = document.getElementById("carat-range-slider");
    DOM.caratValDisplay = document.getElementById("carat-val-display");
    DOM.atelierTotalPrice = document.getElementById("atelier-total-price");
    DOM.specSettingVal = document.getElementById("spec-setting-val");
    DOM.specMetalVal = document.getElementById("spec-metal-val");
    DOM.specCutVal = document.getElementById("spec-cut-val");
    DOM.atelierStageImg = document.getElementById("atelier-stage-img");
  }

  /* --------------------------------------------------------------------------
     01 — PRICING & CURRENCY ENGINE
     -------------------------------------------------------------------------- */
  function formatMoney(amountUSD) {
    const rateObj = JEWELRY_DATA.brand.rates[AppState.currency] || JEWELRY_DATA.brand.rates.USD;
    const converted = amountUSD * rateObj.rate;
    
    // Formatting based on currency precision
    if (AppState.currency === "PKR") {
      return rateObj.symbol + Math.round(converted).toLocaleString("en-PK");
    } else if (AppState.currency === "AED") {
      return rateObj.symbol + Math.round(converted).toLocaleString("en-AE");
    } else {
      return rateObj.symbol + Math.round(converted).toLocaleString("en-US");
    }
  }

  window.changeCurrency = function (code) {
    if (!JEWELRY_DATA.brand.rates[code]) return;
    AppState.currency = code;
    localStorage.setItem("iqbal_currency", code);
    
    if (DOM.currencySelect) {
      DOM.currencySelect.value = code;
    }
    
    renderCatalog();
    renderCart();
    renderWishlist();
    updateAtelierPrice();
    showToast(`Currency updated to ${JEWELRY_DATA.brand.rates[code].label}`);
  };

  /* --------------------------------------------------------------------------
     02 — VIDEO AUTOPLAY INITIALIZATION
     -------------------------------------------------------------------------- */
  function setupVideo() {
    if (!DOM.video) return;
    DOM.video.muted = true;
    DOM.video.setAttribute("muted", "");
    DOM.video.setAttribute("playsinline", "");
    
    const playPromise = DOM.video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: Autoplay prevented by browser, play upon first user interaction
        const startPlay = () => {
          DOM.video.play();
          document.removeEventListener("click", startPlay);
          document.removeEventListener("touchstart", startPlay);
        };
        document.addEventListener("click", startPlay, { once: true });
        document.addEventListener("touchstart", startPlay, { once: true });
      });
    }
  }

  /* --------------------------------------------------------------------------
     03 — SCROLL & HEADER ELEVATION
     -------------------------------------------------------------------------- */
  function setupHeaderScroll() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        DOM.header?.classList.add("scrolled");
      } else {
        DOM.header?.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     04 — COLLECTIONS FILTER & CATALOG
     -------------------------------------------------------------------------- */
  function renderFilterBar() {
    if (!DOM.filterBar) return;
    DOM.filterBar.innerHTML = "";

    JEWELRY_DATA.collections.forEach(col => {
      const btn = document.createElement("button");
      btn.className = `filter-pill ${col.id === AppState.activeFilter ? "active" : ""}`;
      btn.innerHTML = `
        <span>${col.name}</span>
        <span class="filter-count-badge">(${col.count})</span>
      `;
      btn.addEventListener("click", () => {
        filterByCollection(col.id);
      });
      DOM.filterBar.appendChild(btn);
    });
  }

  window.filterByCollection = function (colId) {
    AppState.activeFilter = colId;
    renderFilterBar();
    renderCatalog();

    // Scroll gently to catalog if not already in view
    const colSection = document.getElementById("collections");
    if (colSection && window.scrollY < colSection.offsetTop - 120) {
      colSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  function renderCatalog() {
    if (!DOM.catalogGrid) return;
    DOM.catalogGrid.innerHTML = "";

    const filtered = JEWELRY_DATA.products.filter(prod => {
      if (AppState.activeFilter === "all") return true;
      return prod.collection === AppState.activeFilter;
    });

    if (filtered.length === 0) {
      DOM.catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="color: var(--color-sand-muted); font-size: 1.1rem;">No creations found in this collection category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(prod => {
      const isWishlisted = AppState.wishlist.includes(prod.id);
      const selectedMetalCode = AppState.productSelectedMetals[prod.id] || prod.metalOptions[0].code;
      const selectedMetal = prod.metalOptions.find(m => m.code === selectedMetalCode) || prod.metalOptions[0];
      const currentPriceUSD = prod.priceUSD + (selectedMetal.priceDelta || 0);

      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-image-stage">
          ${prod.tag ? `<span class="product-tag-badge">${prod.tag}</span>` : ""}
          <button class="product-wishlist-btn ${isWishlisted ? "active" : ""}" 
                  onclick="toggleWishlist('${prod.id}', event)" 
                  aria-label="Save to Wishlist" title="Save to Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          
          <img src="${prod.image}" alt="${prod.name}" class="product-img" loading="lazy" />
          ${prod.hoverImage ? `<img src="${prod.hoverImage}" alt="${prod.name} Alternate View" class="product-img-hover" loading="lazy" />` : ""}

          <div class="product-quickview-overlay">
            <button class="btn-quickview" onclick="openQuickView('${prod.id}')">Quick View</button>
          </div>
        </div>

        <div class="product-info-block">
          <div class="product-metal-selector">
            ${prod.metalOptions.map(m => `
              <span class="metal-dot ${m.code === selectedMetalCode ? "active" : ""}" 
                    style="background-color: ${m.hex};" 
                    title="${m.name}"
                    onclick="selectProductMetal('${prod.id}', '${m.code}', event)"></span>
            `).join("")}
          </div>

          <h3 class="product-title" onclick="openQuickView('${prod.id}')">${prod.name}</h3>
          <p class="product-subtitle">${prod.subtitle}</p>

          <div class="product-foot-row">
            <div class="product-price-box">
              <span class="product-price">${formatMoney(currentPriceUSD)}</span>
              <span class="product-cur-code">${selectedMetal.name}</span>
            </div>
            <button class="btn-add-cart-mini" onclick="addToCart('${prod.id}', '${selectedMetalCode}', 1)">
              Add to Bag
            </button>
          </div>
        </div>
      `;
      DOM.catalogGrid.appendChild(card);
    });
  }

  window.selectProductMetal = function (prodId, metalCode, event) {
    if (event) event.stopPropagation();
    AppState.productSelectedMetals[prodId] = metalCode;
    renderCatalog();
  };

  /* --------------------------------------------------------------------------
     05 — CART LOGIC (LOCALSTORAGE & DRAWER)
     -------------------------------------------------------------------------- */
  window.addToCart = function (prodId, metalCode, qty = 1) {
    const product = JEWELRY_DATA.products.find(p => p.id === prodId);
    if (!product) return;

    const chosenMetal = product.metalOptions.find(m => m.code === metalCode) || product.metalOptions[0];
    const finalPriceUSD = product.priceUSD + (chosenMetal.priceDelta || 0);

    const existingIndex = AppState.cart.findIndex(
      item => item.productId === prodId && item.metalCode === chosenMetal.code
    );

    if (existingIndex > -1) {
      AppState.cart[existingIndex].qty += qty;
    } else {
      AppState.cart.push({
        cartItemId: `${prodId}-${chosenMetal.code}-${Date.now()}`,
        productId: prodId,
        name: product.name,
        metalCode: chosenMetal.code,
        metalName: chosenMetal.name,
        priceUSD: finalPriceUSD,
        image: product.image,
        qty: qty
      });
    }

    saveCart();
    renderCart();
    showToast(`Added "${product.name}" to your Selection`);
    toggleCartDrawer(true);
  };

  function saveCart() {
    localStorage.setItem("iqbal_cart", JSON.stringify(AppState.cart));
  }

  window.updateCartQty = function (cartItemId, delta) {
    const item = AppState.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      AppState.cart = AppState.cart.filter(i => i.cartItemId !== cartItemId);
    }

    saveCart();
    renderCart();
  };

  window.removeFromCart = function (cartItemId) {
    AppState.cart = AppState.cart.filter(i => i.cartItemId !== cartItemId);
    saveCart();
    renderCart();
    showToast("Piece removed from selection");
  };

  function renderCart() {
    const totalCount = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotalUSD = AppState.cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);

    if (DOM.cartCountBadge) DOM.cartCountBadge.textContent = totalCount;
    if (DOM.cartDrawerCount) DOM.cartDrawerCount.textContent = `(${totalCount} piece${totalCount === 1 ? "" : "s"})`;
    if (DOM.cartSubtotal) DOM.cartSubtotal.textContent = formatMoney(subtotalUSD);

    if (!DOM.cartItemsList) return;

    if (AppState.cart.length === 0) {
      DOM.cartItemsList.innerHTML = `
        <div class="empty-cart-state">
          <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h4 class="empty-cart-title">Your Selection is Empty</h4>
          <p class="empty-cart-desc">Explore our curated collections of bespoke solitaires and gold bands.</p>
          <button class="btn-card-pill" onclick="toggleCartDrawer(false); filterByCollection('all');">Explore Catalogue</button>
        </div>
      `;
      return;
    }

    DOM.cartItemsList.innerHTML = AppState.cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-metal-tag">${item.metalName}</span>
          <div class="cart-item-bottom">
            <div class="cart-qty-ctrl">
              <button class="qty-btn" onclick="updateCartQty('${item.cartItemId}', -1)">-</button>
              <span class="qty-number">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.cartItemId}', 1)">+</button>
            </div>
            <span class="cart-item-price">${formatMoney(item.priceUSD * item.qty)}</span>
            <span class="cart-item-remove" onclick="removeFromCart('${item.cartItemId}')">Remove</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  window.toggleCartDrawer = function (forceOpen) {
    if (!DOM.cartDrawer || !DOM.cartBackdrop) return;
    const shouldOpen = forceOpen !== undefined ? forceOpen : !DOM.cartDrawer.classList.contains("active");

    if (shouldOpen) {
      DOM.cartDrawer.classList.add("active");
      DOM.cartBackdrop.classList.add("active");
      document.body.style.overflow = "hidden";
      renderCart();
    } else {
      DOM.cartDrawer.classList.remove("active");
      DOM.cartBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  /* --------------------------------------------------------------------------
     06 — WISHLIST SYSTEM
     -------------------------------------------------------------------------- */
  window.toggleWishlist = function (prodId, event) {
    if (event) event.stopPropagation();
    const index = AppState.wishlist.indexOf(prodId);
    const product = JEWELRY_DATA.products.find(p => p.id === prodId);

    if (index > -1) {
      AppState.wishlist.splice(index, 1);
      showToast(`Removed "${product ? product.name : "Piece"}" from Wishlist`);
    } else {
      AppState.wishlist.push(prodId);
      showToast(`Saved "${product ? product.name : "Piece"}" to Wishlist`);
    }

    localStorage.setItem("iqbal_wishlist", JSON.stringify(AppState.wishlist));
    renderWishlist();
    renderCatalog();
  };

  function renderWishlist() {
    const count = AppState.wishlist.length;
    if (DOM.wishlistCountBadge) DOM.wishlistCountBadge.textContent = count;
    if (DOM.wishlistDrawerCount) DOM.wishlistDrawerCount.textContent = `(${count} piece${count === 1 ? "" : "s"})`;

    if (!DOM.wishlistItemsList) return;

    if (count === 0) {
      DOM.wishlistItemsList.innerHTML = `
        <div class="empty-cart-state">
          <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h4 class="empty-cart-title">No Saved Pieces Yet</h4>
          <p class="empty-cart-desc">Click the heart icon on any jewelry piece to save it to your private portfolio.</p>
        </div>
      `;
      return;
    }

    const savedProducts = JEWELRY_DATA.products.filter(p => AppState.wishlist.includes(p.id));

    DOM.wishlistItemsList.innerHTML = savedProducts.map(prod => `
      <div class="cart-item-row">
        <div class="cart-item-thumb">
          <img src="${prod.image}" alt="${prod.name}" />
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${prod.name}</h4>
          <span class="cart-item-metal-tag">${prod.subtitle}</span>
          <div class="cart-item-bottom">
            <span class="cart-item-price">${formatMoney(prod.priceUSD)}</span>
            <button class="btn-add-cart-mini" onclick="addToCart('${prod.id}', '${prod.metalOptions[0].code}', 1); toggleWishlist('${prod.id}');">
              Move to Bag
            </button>
            <span class="cart-item-remove" onclick="toggleWishlist('${prod.id}')">Remove</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  window.toggleWishlistDrawer = function (forceOpen) {
    if (!DOM.wishlistDrawer || !DOM.wishlistBackdrop) return;
    const shouldOpen = forceOpen !== undefined ? forceOpen : !DOM.wishlistDrawer.classList.contains("active");

    if (shouldOpen) {
      DOM.wishlistDrawer.classList.add("active");
      DOM.wishlistBackdrop.classList.add("active");
      document.body.style.overflow = "hidden";
      renderWishlist();
    } else {
      DOM.wishlistDrawer.classList.remove("active");
      DOM.wishlistBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  /* --------------------------------------------------------------------------
     07 — MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  window.toggleMobileMenu = function () {
    if (!DOM.mobileDrawer || !DOM.mobileOverlay) return;
    const isActive = DOM.mobileDrawer.classList.contains("active");

    if (!isActive) {
      DOM.mobileDrawer.classList.add("active");
      DOM.mobileOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      DOM.mobileDrawer.classList.remove("active");
      DOM.mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  /* --------------------------------------------------------------------------
     08 — INTERACTIVE BESPOKE RING ATELIER CONFIGURATOR
     -------------------------------------------------------------------------- */
  function initAtelier() {
    renderAtelierControls();
    updateAtelierPrice();
  }

  function renderAtelierControls() {
    if (!DOM.settingPillsContainer) return;

    // Step 1: Settings
    DOM.settingPillsContainer.innerHTML = JEWELRY_DATA.bespokeAtelier.settings.map(s => `
      <button type="button" class="atelier-pill-choice ${s.id === AppState.atelier.settingId ? "active" : ""}" 
              onclick="selectAtelierSetting('${s.id}')">
        ${s.name}
      </button>
    `).join("");

    // Step 2: Metals
    DOM.metalSwatchesContainer.innerHTML = JEWELRY_DATA.bespokeAtelier.metals.map(m => `
      <div class="metal-swatch-card ${m.code === AppState.atelier.metalCode ? "active" : ""}" 
           onclick="selectAtelierMetal('${m.code}')">
        <span class="swatch-disc" style="background-color: ${m.hex};"></span>
        <span class="swatch-name">${m.name}</span>
      </div>
    `).join("");

    // Step 3: Cuts
    DOM.diamondCutsContainer.innerHTML = JEWELRY_DATA.bespokeAtelier.diamondCuts.map(c => `
      <button type="button" class="atelier-pill-choice ${c.id === AppState.atelier.cutId ? "active" : ""}" 
              onclick="selectAtelierCut('${c.id}')">
        ${c.name}
      </button>
    `).join("");
  }

  window.selectAtelierSetting = function (settingId) {
    AppState.atelier.settingId = settingId;
    renderAtelierControls();
    updateAtelierPrice();
  };

  window.selectAtelierMetal = function (metalCode) {
    AppState.atelier.metalCode = metalCode;
    renderAtelierControls();
    updateAtelierPrice();
  };

  window.selectAtelierCut = function (cutId) {
    AppState.atelier.cutId = cutId;
    renderAtelierControls();
    updateAtelierPrice();
  };

  window.updateAtelierCarat = function (val) {
    AppState.atelier.carat = parseFloat(val);
    if (DOM.caratValDisplay) {
      DOM.caratValDisplay.textContent = `${AppState.atelier.carat.toFixed(2)} ct`;
    }
    updateAtelierPrice();
  };

  function updateAtelierPrice() {
    const curSetting = JEWELRY_DATA.bespokeAtelier.settings.find(s => s.id === AppState.atelier.settingId);
    const curMetal = JEWELRY_DATA.bespokeAtelier.metals.find(m => m.code === AppState.atelier.metalCode);
    const curCut = JEWELRY_DATA.bespokeAtelier.diamondCuts.find(c => c.id === AppState.atelier.cutId);

    if (!curSetting || !curMetal || !curCut) return;

    // Diamond price formula: baseDiamondPrice * (carat^1.55) * cutMultiplier
    const baseDiamondUSD = 2400;
    const caratFactor = Math.pow(AppState.atelier.carat, 1.48);
    const diamondUSD = baseDiamondUSD * caratFactor * curCut.multiplier;
    const totalUSD = Math.round(curSetting.basePriceUSD + curMetal.priceModifier + diamondUSD);

    if (DOM.atelierTotalPrice) {
      DOM.atelierTotalPrice.textContent = formatMoney(totalUSD);
    }

    // Update specs view
    if (DOM.specSettingVal) DOM.specSettingVal.textContent = curSetting.name;
    if (DOM.specMetalVal) DOM.specMetalVal.textContent = curMetal.name;
    if (DOM.specCutVal) DOM.specCutVal.textContent = `${AppState.atelier.carat.toFixed(2)} ct ${curCut.name}`;

    // Swap stage image preview dynamically
    if (DOM.atelierStageImg) {
      if (curCut.id === "emerald") {
        DOM.atelierStageImg.src = "assets/product-emerald-ring.jpg";
      } else if (curSetting.id === "contour-band") {
        DOM.atelierStageImg.src = "assets/product-duo-band.jpg";
      } else {
        DOM.atelierStageImg.src = "assets/product-solitaire.jpg";
      }
    }
  }

  window.commissionCustomRing = function () {
    const curSetting = JEWELRY_DATA.bespokeAtelier.settings.find(s => s.id === AppState.atelier.settingId);
    const curMetal = JEWELRY_DATA.bespokeAtelier.metals.find(m => m.code === AppState.atelier.metalCode);
    const curCut = JEWELRY_DATA.bespokeAtelier.diamondCuts.find(c => c.id === AppState.atelier.cutId);

    const baseDiamondUSD = 2400;
    const caratFactor = Math.pow(AppState.atelier.carat, 1.48);
    const diamondUSD = baseDiamondUSD * caratFactor * curCut.multiplier;
    const totalUSD = Math.round(curSetting.basePriceUSD + curMetal.priceModifier + diamondUSD);

    AppState.cart.push({
      cartItemId: `bespoke-ring-${Date.now()}`,
      productId: "custom-bespoke",
      name: `Bespoke Ring: ${AppState.atelier.carat.toFixed(2)} ct ${curCut.name}`,
      metalCode: curMetal.code,
      metalName: `${curMetal.name} (${curSetting.name})`,
      priceUSD: totalUSD,
      image: DOM.atelierStageImg ? DOM.atelierStageImg.src : "assets/product-solitaire.jpg",
      qty: 1
    });

    saveCart();
    renderCart();
    toggleCartDrawer(true);
    showToast("Bespoke Atelier Commission added to your Selection");
  };

  /* --------------------------------------------------------------------------
     09 — QUICK VIEW MODAL
     -------------------------------------------------------------------------- */
  window.openQuickView = function (prodId) {
    const prod = JEWELRY_DATA.products.find(p => p.id === prodId);
    if (!prod || !DOM.quickviewContent || !DOM.quickviewModal) return;

    const selectedMetalCode = AppState.productSelectedMetals[prod.id] || prod.metalOptions[0].code;
    const selectedMetal = prod.metalOptions.find(m => m.code === selectedMetalCode) || prod.metalOptions[0];
    const priceUSD = prod.priceUSD + (selectedMetal.priceDelta || 0);

    DOM.quickviewContent.innerHTML = `
      <div class="qv-media-stage">
        <img src="${prod.image}" alt="${prod.name}" />
      </div>
      <div class="qv-info-col">
        <span class="section-label-gold">${prod.category}</span>
        <h2 class="qv-title">${prod.name}</h2>
        <p class="qv-subtitle">${prod.subtitle}</p>
        <div class="qv-price" id="qv-price-display">${formatMoney(priceUSD)}</div>
        <p class="qv-desc">${prod.description}</p>

        <div style="margin-bottom: 1.5rem;">
          <span class="step-label">SELECT ALLOY</span>
          <div class="metal-swatches-row">
            ${prod.metalOptions.map(m => `
              <div class="metal-swatch-card ${m.code === selectedMetalCode ? "active" : ""}" 
                   onclick="changeQuickViewMetal('${prod.id}', '${m.code}')">
                <span class="swatch-disc" style="background-color: ${m.hex};"></span>
                <span class="swatch-name">${m.name}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="btn-primary" style="flex: 1;" onclick="addToCart('${prod.id}', '${selectedMetalCode}', 1); closeQuickView();">
            Add to Bag
          </button>
          <button class="btn-hero-atelier" onclick="toggleWishlist('${prod.id}'); closeQuickView();">
            Save to Wishlist
          </button>
        </div>
      </div>
    `;

    DOM.quickviewModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.changeQuickViewMetal = function (prodId, metalCode) {
    AppState.productSelectedMetals[prodId] = metalCode;
    openQuickView(prodId);
    renderCatalog();
  };

  window.closeQuickView = function () {
    if (!DOM.quickviewModal) return;
    DOM.quickviewModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  /* --------------------------------------------------------------------------
     10 — ATELIER APPOINTMENT BOOKING MODAL
     -------------------------------------------------------------------------- */
  window.openAtelierModal = function () {
    if (!DOM.atelierModal) return;
    DOM.atelierModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeAtelierModal = function () {
    if (!DOM.atelierModal) return;
    DOM.atelierModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  window.handleAppointmentSubmit = function (e) {
    e.preventDefault();
    closeAtelierModal();
    showToast("Private Consultation request received. Our Master Goldsmith will contact you within 24 hours.");
  };

  window.handleNewsletter = function (e) {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (input) input.value = "";
    showToast("Welcome to the Iqbal Sons Private Client Dispatch.");
  };

  window.proceedToCheckout = function () {
    if (AppState.cart.length === 0) {
      showToast("Please add pieces to your selection before proceeding.");
      return;
    }
    const subtotalUSD = AppState.cart.reduce((sum, item) => sum + (item.priceUSD * item.qty), 0);
    const subtotalFormatted = formatMoney(subtotalUSD);
    
    toggleCartDrawer(false);
    showToast(`Order initiated for ${subtotalFormatted}. Connecting to luxury concierge billing gateway...`);
  };

  /* --------------------------------------------------------------------------
     11 — HERITAGE PILLARS & REVIEWS
     -------------------------------------------------------------------------- */
  function renderHeritagePillars() {
    if (!DOM.heritagePillarsGrid) return;
    DOM.heritagePillarsGrid.innerHTML = JEWELRY_DATA.heritagePillars.map(p => `
      <div class="pillar-card">
        <div class="pillar-icon-box">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <h4 class="pillar-title">${p.title}</h4>
        <p class="pillar-desc">${p.description}</p>
      </div>
    `).join("");
  }

  /* --------------------------------------------------------------------------
     12 — CHIC TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  function showToast(message) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fadeout");
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     13 — BOOTSTRAP APPLICATION
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initDOMElements();
    setupVideo();
    setupHeaderScroll();
    renderFilterBar();
    renderCatalog();
    renderHeritagePillars();
    initAtelier();
    renderCart();
    renderWishlist();

    // Set initial currency in select
    if (DOM.currencySelect) {
      DOM.currencySelect.value = AppState.currency;
    }
  });

})();
