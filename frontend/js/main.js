import { state } from './state.js';
import { api } from './api.js';

/* Initialize Mirrorverse Shell */

function renderHeader() {
    const headerEl = document.getElementById('main-header');
    if (!headerEl) return;

    const count = state.getCartCount();

    headerEl.innerHTML = `
        <div class="header-top">
            <div class="logo">
                <a href="index.html">Mirrorverse<span style="color:var(--accent);">.</span></a>
            </div>
            
            <div class="search-bar">
                <input type="text" placeholder="Search elite fashion..." id="main-search">
                <button id="search-btn"><i class="fas fa-search"></i></button>
            </div>
            
            <nav class="nav-links">
                <a href="profile.html" class="nav-item">
                    <div style="font-size: 0.7rem; opacity: 0.6; font-weight: normal;">Hello, Guest</div>
                    <div>Account & Profile</div>
                </a>
                <a href="cart.html" class="nav-item" style="display:flex; align-items:center; gap:8px; position:relative;">
                    <i class="fas fa-shopping-bag" style="font-size:1.5rem;"></i>
                    <span id="cart-badge" class="cart-count">${count}</span>
                    <span>Bag</span>
                </a>
            </nav>
        </div>
    `;

    // Search logic
    const input = document.getElementById('main-search');
    const btn = document.getElementById('search-btn');
    if (input && btn) {
        const handleSearch = () => {
            const query = input.value.trim().toLowerCase();
            if (query) window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        };
        btn.onclick = handleSearch;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleSearch(); };
    }
}

function renderFooter() {
    const footerEl = document.getElementById('main-footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
        <div style="background: var(--primary); color: white; padding: 5rem 0 2rem; margin-top: 5rem;">
            <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px;">
                <div>
                    <h4 style="margin-bottom: 1.5rem; letter-spacing: 1px;">MIRRORVERSE</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">Elevating your fashion experience through AI-driven precision fitting.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Experience</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 2;">AI Size Engine<br>Virtual Try-On<br>Elite Benefits</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Support</h4>
                    <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 2;">Help Center<br>Returns<br>Shipping</p>
                </div>
            </div>
            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4rem; padding-top: 2rem; color: rgba(255,255,255,0.4); font-size: 0.8rem;">
                &copy; 2026 Mirrorverse Smart Fit. All Rights Reserved.
            </div>
        </div>
    `;
}

// Global update logic
state.subscribe(() => {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = state.getCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();

    // If we're on index or shop, handle featured items
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) loadFeatured(featuredGrid);
});

async function loadFeatured(grid) {
    try {
        const response = await api.getProducts({ gender: state.gender });
        const products = response.data || response; // Handle both array and object responses
        if (Array.isArray(products)) {
            grid.innerHTML = products.slice(0, 4).map(p => renderCard(p)).join('');
        }
    } catch (err) {
        console.error("Load featured failed:", err);
    }
}

export function renderCard(p, isPersonalized = false) {
    console.log('Rendering elite card for:', p.id, p.name);
    return `
        <div class="product-card" data-id="${p.id}">
            <a href="product.html?id=${p.id}" style="text-decoration:none; color:inherit;">
                <div style="position:relative; overflow:hidden; border-radius:8px;">
                    <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/400x600?text=Fashion+Elite'">
                    ${isPersonalized ? '<div style="background:var(--accent); color:white; padding:4px 12px; font-size:0.7rem; font-weight:900; position:absolute; top:12px; left:12px; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.2);">PERFECT FIT</div>' : ''}
                </div>
                <div class="product-name">${p.name}</div>
                <div class="rating">
                    ${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 !== 0 ? '½' : ''} 
                    <span style="color:var(--text-muted); font-size:0.8rem; margin-left:5px;">(${p.reviews})</span>
                </div>
                <div class="price-box">₹${p.price.toLocaleString('en-IN')}</div>
            </a>
            <div style="display:flex; gap:8px; margin-top:10px;">
                <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" style="flex:1;">
                    <i class="fas fa-plus"></i> Bag
                </button>
                <button class="btn btn-buy buy-now-btn" data-id="${p.id}" style="flex:1;">
                     Buy Now
                </button>
            </div>
        </div>
    `;
}

// Global listener for Add to Cart and Buy Now
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const id = e.target.dataset.id;
        const product = await api.getProduct(id);
        state.addToCart(product);
        alert(`Elite purchase added: ${product.name}`);
    }
    if (e.target.classList.contains('buy-now-btn')) {
        const id = e.target.dataset.id;
        window.location.href = 'checkout.html?buynow=' + id;
    }
});
