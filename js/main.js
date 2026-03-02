// js/main.js

const API_BASE_URL = 'http://localhost:5000/api'; // Change this for production
let currentPage = 1;
const productsPerPage = 12;
let isFetching = false;
let hasMore = true;
let currentFilters = { cat: 'all', search: '', size: '' };

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const allProductsGrid = document.getElementById('all-products-grid');
  const featuredGrid = document.getElementById('featured-products-grid');

  if (allProductsGrid || featuredGrid) {
    initApp(allProductsGrid, featuredGrid);
  }
});

async function initApp(allGrid, featuredGrid) {
  // Initial fetch for featured products from API
  if (featuredGrid) {
    try {
      const res = await fetch(`${API_BASE_URL}/dresses?limit=8`);
      const data = await res.json();
      renderProducts(data.dresses, featuredGrid);
    } catch (e) {
      console.error("InitApp featured error:", e);
    }
  }

  if (allGrid) {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.cat = urlParams.get('cat') || 'all';
    currentFilters.search = urlParams.get('search') || '';
    currentFilters.size = urlParams.get('size') || '';

    loadMoreProducts(allGrid, true); // Initial load from API

    // Setup Infinite Scroll
    setupInfiniteScroll(allGrid);
  }
}

function setupInfiniteScroll(container) {
  const sentinel = document.createElement('div');
  sentinel.id = 'infinite-scroll-sentinel';
  sentinel.style.height = '10px';
  container.after(sentinel);

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetching && hasMore) {
      loadMoreProducts(container);
    }
  }, { rootMargin: '300px' });

  observer.observe(sentinel);
}

async function loadMoreProducts(container, isInitial = false) {
  if (isFetching || !hasMore) return;
  isFetching = true;

  // Show loading skeleton
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton-loader';
  skeleton.innerText = 'Syncing unlimited collection...';
  if (!isInitial) container.after(skeleton);

  try {
    const query = new URLSearchParams({
      page: currentPage,
      limit: productsPerPage,
      category: currentFilters.cat,
      search: currentFilters.search,
      size: currentFilters.size
    });

    const response = await fetch(`${API_BASE_URL}/dresses?${query}`);
    if (!response.ok) throw new Error("API Connection Failed");

    const data = await response.json();
    const pageItems = data.dresses;

    if (pageItems.length > 0) {
      renderProducts(pageItems, container, !isInitial);
      currentPage++;
    }

    if (currentPage > data.totalPages || pageItems.length === 0) {
      hasMore = false;
      if (data.totalItems > 0) {
        const endMsg = document.createElement('div');
        endMsg.style.textAlign = 'center';
        endMsg.style.padding = '40px';
        endMsg.style.color = '#565959';
        endMsg.innerText = "You've viewed all our exclusive results.";
        container.after(endMsg);
      }
    }

    const resultsCount = document.getElementById('results-count');
    if (resultsCount) resultsCount.innerText = data.totalItems;

  } catch (error) {
    console.error('Failed to load products from API:', error);
  } finally {
    isFetching = false;
    if (skeleton) skeleton.remove();
  }
}


function renderProducts(products, container, append = false) {
  if (!container) return;
  if (!append) container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const priceParts = product.price.toFixed(2).split('.');
    const whole = priceParts[0];
    const decimal = priceParts[1];

    const fullStars = Math.floor(product.rating);
    const hasHalf = (product.rating % 1) >= 0.5;
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`;
      } else if (i === fullStars + 1 && hasHalf) {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></svg>`;
      } else {
        starsHTML += `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`;
      }
    }

    const isPerfectFit = currentFilters.size && product.sizes.includes(currentFilters.size);
    const perfectFitBadge = isPerfectFit ? `<div class="perfect-fit-badge">Perfect Fit for ${currentFilters.size}</div>` : '';

    card.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(35, 47, 62, 0.9); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
                    ${product.discount}
                </div>
            </a>
            <div class="product-details">
                ${perfectFitBadge}
                <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="rating-container">
                    <div class="stars-svg">${starsHTML}</div>
                    <span class="rating-count">${product.ratingCount.toLocaleString()}</span>
                </div>
                <div class="bought-count">${product.boughtPastMonth}</div>
                <div class="price-container">
                    <span class="price-symbol">$</span>
                    <span class="price-whole">${whole}</span>
                    <span class="price-decimal">${decimal}</span>
                    <span class="original-price">$${product.originalPrice.toFixed(0)}</span>
                </div>
                <div style="font-size: 11px; color: #565959; margin-top: 4px;">
                   Color: ${product.color} | Fabric: ${product.fabric}
                </div>
                <div class="delivery-badge">
                    ${product.freeDelivery ? '<span class="free-delivery">FREE delivery</span>' : ''}
                </div>
                <button class="btn btn-primary" onclick="addToCart(event, '${product.id}')" style="margin-top: 8px; width: 100%; border-radius: 4px; padding: 6px;">Add to Cart</button>
            </div>
        `;
    container.appendChild(card);
  });
}

window.addToCart = function (e, productId) {
  if (e) e.preventDefault();
  let cart = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];
  cart.push(productId);
  localStorage.setItem('mirrorverse_cart', JSON.stringify(cart));
  updateCartCount();
  showToast('Added to Cart');
};

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];
  const count = cart.length;
  const hCount = document.getElementById('header-cart-count');
  const bCount = document.getElementById('bot-cart-count');
  if (hCount) hCount.innerText = count;
  if (bCount) bCount.innerText = count;
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
