import { api } from './api.js';
import { state } from './state.js';
import { renderCard } from './main.js';

/* Mirrorverse Infinite Scroll Engine */

let currentPage = 1;
let loading = false;
let hasMore = true;
const limit = 12;

export async function loadShopProducts(append = false) {
    if (loading || !hasMore) return;
    loading = true;

    const grid = document.getElementById('product-grid');
    const sentinel = document.getElementById('infinite-scroll-sentinel');
    const noResults = document.getElementById('no-results');
    const banner = document.getElementById('personalized-banner');

    const urlParams = new URLSearchParams(window.location.search);
    const gender = urlParams.get('gender') || state.gender;
    const category = urlParams.get('category') || null;
    const search = urlParams.get('search') || null;
    const size = urlParams.get('size') || null;
    const isScan = urlParams.get('scan') === 'success';

    if (isScan) {
        if (banner) banner.style.display = 'block';
        const userSizeEl = document.getElementById('user-size');
        if (userSizeEl) userSizeEl.innerText = size;
        if (grid) grid.style.borderTop = "5px solid var(--amazon-accent)";
    }

    try {
        let products;
        if (size) {
            products = await api.getRecommendations(gender, size);
        } else {
            products = await api.getProducts(gender, category, search);
        }

        // Pagination Mock (Slicing the 200 items)
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        const pageItems = products.slice(start, end);

        if (!append) grid.innerHTML = '';

        if (pageItems.length === 0 && !append) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            grid.innerHTML += pageItems.map(p => renderCard(p, isScan)).join('');
        }

        hasMore = end < products.length;
        currentPage++;

    } catch (err) {
        console.error("Load shop products failed:", err);
    } finally {
        loading = false;
    }
}

// Observer logic
const sentinel = document.getElementById('infinite-scroll-sentinel');
if (sentinel) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadShopProducts(true);
        }
    });
    observer.observe(sentinel);
}

// Initial load
if (document.getElementById('product-grid')) {
    loadShopProducts();
}
