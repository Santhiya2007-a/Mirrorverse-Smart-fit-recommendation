// js/main.js – loads directly from products.json (no CORS issues)

const API_BASE_URL = 'http://localhost:5000/api';
const PRODUCTS_JSON_URL = 'frontend/data/products.json';
let allProducts = [];
let displayedProducts = [];
let currentPage = 0;
const PAGE_SIZE = 24;
let currentFilters = { cat: 'all', search: '', size: '', style: 'all' };
let isFetching = false;

document.addEventListener('DOMContentLoaded', async () => {
  updateCartCount();
  await loadAllProducts();

  const allProductsGrid = document.getElementById('all-products-grid');
  const featuredGrid = document.getElementById('featured-products-grid');

  if (featuredGrid) {
    const featured = allProducts.slice(0, 8);
    renderProducts(featured, featuredGrid);
  }

  if (allProductsGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.cat = urlParams.get('cat') || 'all';
    currentFilters.search = urlParams.get('search') || '';
    currentFilters.size = urlParams.get('size') || '';
    currentFilters.style = urlParams.get('style') || 'all';

    applyFiltersAndDisplay(allProductsGrid);
    setupInfiniteScroll(allProductsGrid);
  }
});

async function loadAllProducts() {
  try {
    // Try live API first for dynamic data
    const res = await fetch(`${API_BASE_URL}/dresses`);
    if (res.ok) {
      const result = await res.json();
      allProducts = result.data;
      console.log('Loaded from API:', allProducts.length);
      return;
    }
    
    // Fallback to static JSON
    const staticRes = await fetch(PRODUCTS_JSON_URL);
    if (!staticRes.ok) throw new Error('Failed to load');
    allProducts = await staticRes.json();
    console.log('Loaded from static JSON:', allProducts.length);
  } catch (e) {
    console.error('Could not load products:', e);
    allProducts = [];
  }
}

function getFilteredProducts() {
  let filtered = [...allProducts];

  // Category filter
  if (currentFilters.cat && currentFilters.cat !== 'all') {
    filtered = filtered.filter(p =>
      p.category && p.category.toLowerCase().includes(currentFilters.cat.toLowerCase())
    );
  }

  // Search filter
  if (currentFilters.search) {
    const q = currentFilters.search.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  // Size filter
  if (currentFilters.size) {
    const sz = currentFilters.size.toUpperCase();
    filtered = filtered.filter(p => {
      const sizes = Array.isArray(p.availableSizes) ? p.availableSizes : (p.availableSizes || '').split(',');
      return sizes.map(s => s.trim().toUpperCase()).includes(sz);
    });
  }

  // Style filter
  if (currentFilters.style && currentFilters.style !== 'all') {
    filtered = filtered.filter(p =>
      p.style && p.style.toLowerCase() === currentFilters.style.toLowerCase()
    );
  }

  return filtered;
}

function applyFiltersAndDisplay(container) {
  currentPage = 0;
  displayedProducts = getFilteredProducts();

  // Update results count
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) resultsCount.innerText = displayedProducts.length;

  container.innerHTML = '';

  // Inject Premium Hero Banner at the top of the grid ONLY if we are viewing everything and not searching
  if (currentFilters.cat === 'all' && currentFilters.size === '' && currentFilters.search === '') {
    const banner = document.createElement('div');
    banner.className = 'hero-banner-wrapper';
    banner.style.gridColumn = '1 / -1'; // Span full width of grid
    // Ensure height allows the contents to display correctly
    banner.style.minHeight = '180px';
    banner.style.marginBottom = '24px';
    banner.innerHTML = `
        <div style="background: linear-gradient(135deg, #111827 0%, #374151 100%); border-radius: var(--radius-md); padding: 24px; min-height: 180px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
            <div style="flex: 1; z-index: 2; display: flex; flex-direction: column; justify-content: center;">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <span style="background: #e11d48; color: white; padding: 4px 8px; font-size: 10px; font-weight: 800; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Deal of the Day</span>
                    <span style="color: #cbd5e1; font-size: 11px; font-weight: 600;">Ends in 12:45:00</span>
                </div>
                <h2 style="font-size: 1.5rem; font-weight: 800; color: #f8fafc; margin-bottom: 8px; line-height: 1.2;">Premium Designer<br><span style="color: #fbbf24;">Evening Collection</span></h2>
                <h3 style="font-size: 13px; font-weight: 400; color: #cbd5e1; margin-bottom: 16px; max-width: 80%;">Save up to 60% on our top trending modern and ultra modern fits.</h3>
                <div>
                    <a href="shop.html?style=Ultra Modern" style="display: inline-block; background: white; color: #0f172a; padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.2s;">Shop Now ›</a>
                </div>
            </div>
            <div style="position: absolute; right: -5%; top: -20px; width: 60%; height: 140%; z-index: 1; opacity: 0.9;">
                <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 4px solid rgba(255,255,255,0.1); transform: rotate(10deg); mask-image: linear-gradient(to right, transparent, black 30%); -webkit-mask-image: linear-gradient(to right, transparent, black 30%);" alt="Premium Dress">
            </div>
        </div>
      `;
    container.appendChild(banner);
  }

  loadNextPage(container, true);
}

function loadNextPage(container, isInitial = false) {
  if (isFetching) return;
  isFetching = true;

  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = displayedProducts.slice(start, end);

  if (pageItems.length > 0) {
    renderProducts(pageItems, container, !isInitial);
    currentPage++;
  }

  // Show end message if all products displayed
  if (currentPage * PAGE_SIZE >= displayedProducts.length && displayedProducts.length > 0) {
    const existing = document.getElementById('end-msg');
    if (!existing) {
      const endMsg = document.createElement('div');
      endMsg.id = 'end-msg';
      endMsg.style.cssText = 'text-align:center;padding:40px;color:#565959;grid-column:1/-1;';
      endMsg.innerText = `Showing all ${displayedProducts.length} dresses ✓`;
      container.appendChild(endMsg);
    }
  }

  isFetching = false;
}

function setupInfiniteScroll(container) {
  const sentinel = document.createElement('div');
  sentinel.id = 'infinite-scroll-sentinel';
  sentinel.style.height = '10px';
  container.after(sentinel);

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetching) {
      loadNextPage(container);
    }
  }, { rootMargin: '400px' });

  observer.observe(sentinel);
}

function renderProducts(products, container, append = false) {
  console.log('Rendering products:', products.length, 'Append:', append);
  if (!container) return;
  if (!append) container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const price = Math.round(parseFloat(product.price) || 0);
    const originalPrice = Math.round(parseFloat(product.originalPrice) || price);
    // Format as Indian currency with commas: 1300 → 1,300
    const formatINR = (n) => n.toLocaleString('en-IN');
    const priceFormatted = formatINR(price);
    const origFormatted = formatINR(originalPrice);

    const rating = parseFloat(product.rating) || 0;
    const fullStars = Math.floor(rating);
    const hasHalf = (rating % 1) >= 0.5;
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffa41c"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      } else if (i === fullStars + 1 && hasHalf) {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="#ffa41c"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03 3.45-2.99zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>`;
      } else {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      }
    }

    const sizes = Array.isArray(product.availableSizes)
      ? product.availableSizes
      : (product.availableSizes || '').split(',').map(s => s.trim());

    const isPerfectFit = currentFilters.size && sizes.map(s => s.toUpperCase()).includes(currentFilters.size.toUpperCase());
    const perfectFitBadge = isPerfectFit
      ? `<div style="background:#febd69;color:#111;padding:2px 8px;font-size:10px;font-weight:700;border-radius:3px;margin-bottom:4px;">✓ Perfect Fit – ${currentFilters.size}</div>`
      : '';

    const discountBadge = product.discount > 0
      ? `<div style="position:absolute;top:8px;left:8px;background:#cc0c39;color:white;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">${product.discount}% OFF</div>`
      : '';
    const newBadge = product.isNew
      ? `<div style="position:absolute;top:8px;right:8px;background:#067d62;color:white;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;">NEW</div>`
      : '';

    const sizeTags = sizes.slice(0, 6).map(s =>
      `<span style="border:1px solid #ddd;border-radius:3px;padding:1px 5px;font-size:10px;color:#333;">${s}</span>`
    ).join('');

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80'">
        ${discountBadge}
        ${newBadge}
      </a>
      <div class="product-details">
        ${perfectFitBadge}
        <a href="product.html?id=${product.id}" class="product-name">${product.name || 'Designer Dress'}</a>
        <div class="rating-container">
          <div class="stars-svg">${starsHTML}</div>
          <span class="rating-count">(${(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;margin-bottom:8px;">${sizeTags}</div>
        <div class="price-container">
          <span class="price-symbol">₹</span>
          <span class="price-whole">${priceFormatted}</span>
          ${originalPrice > price
        ? `<span class="original-price">₹${origFormatted}</span>`
        : ''}
        </div>
        <div style="font-size:11px;color:var(--color-text-muted);margin-top:4px;">
           ${product.style || product.category || ''} ${product.color ? '· ' + product.color : ''}
        </div>
        ${product.freeDelivery
        ? '<div class="delivery-badge free-delivery">✓ FREE Delivery</div>'
        : '<div class="delivery-badge" style="height:18px;"></div>'}
        <div style="display:flex; gap:8px; margin-top:auto;">
          <button class="btn btn-primary" onclick="addToCart(event,'${product.id}')" style="flex:1;">Add to Cart</button>
          <button class="btn btn-buy" onclick="buyNow(event,'${product.id}')" style="flex:1;">Buy Now</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.addToCart = function (e, productId) {
  if (e) e.preventDefault();
  let cart = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];
  if (!cart.includes(String(productId))) cart.push(String(productId));
  localStorage.setItem('mirrorverse_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('Added to Cart ✓');
};

window.buyNow = function (e, productId) {
  if (e) e.preventDefault();
  window.location.href = 'checkout.html?buynow=' + productId;
};

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];
  const count = cart.length;
  ['header-cart-count', 'bot-cart-count'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = count;
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'amazon-toast';
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// Live countdown timer for deal banners
(function startDealCountdown() {
  // Start from a fixed offset: 11h 59m 59s after page load
  let totalSeconds = 11 * 3600 + 59 * 60 + 59;
  function tick() {
    if (totalSeconds <= 0) return;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    const display = `${h}:${m}:${s}`;
    document.querySelectorAll('.deal-timer').forEach(el => { el.textContent = display; });
    totalSeconds--;
  }
  tick();
  setInterval(tick, 1000);
})();
