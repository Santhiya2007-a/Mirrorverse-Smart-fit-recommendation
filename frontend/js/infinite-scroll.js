import { api } from './api.js';
import { state } from './state.js';
import { renderCard } from './main.js';

/* Mirrorverse MVP Grid Loader */

export async function loadShopProducts() {
    const grid = document.getElementById('product-grid');
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
        let response;
        if (size) {
            response = await api.getRecommendationsBySize(size, { gender });
        } else {
            response = await api.getDresses({ gender, category, search });
        }

        const products = response.data || response;
        grid.innerHTML = '';

        if (!Array.isArray(products) || products.length === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            grid.innerHTML = products.map(p => renderCard(p, isScan)).join('');
        }

    } catch (err) {
        console.error("Load shop products failed:", err);
    }
}

// Initial load
if (document.getElementById('product-grid')) {
    loadShopProducts();
}
