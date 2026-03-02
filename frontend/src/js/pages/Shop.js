import Component from '../base/Component.js';
import { apiService } from '../services/apiService.js';
import { store } from '../store.js';

export default class Shop extends Component {
    constructor(containerId, props = {}) {
        super(containerId, props);
        const hash = window.location.hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(hash);
        this.state = {
            dresses: [],
            page: 1,
            totalPages: 1,
            loading: false,
            category: urlParams.get('category') || 'all',
            search: urlParams.get('search') || '',
            size: urlParams.get('size') || '',
            sort: urlParams.get('sort') || 'newest'
        };
        this.observer = null;
    }

    async afterRender() {
        if (this.state.dresses.length === 0) {
            await this.loadDresses();
        }
        this.setupInfiniteScroll();
    }

    async loadDresses(append = false) {
        if (this.state.loading) return;
        this.setState({ loading: true });

        const { dresses, totalPages } = await apiService.getDresses({
            category: this.state.category,
            search: this.state.search,
            size: this.state.size,
            page: this.state.page,
            sort: this.state.sort
        });

        this.setState({
            dresses: append ? [...this.state.dresses, ...dresses] : dresses,
            totalPages: totalPages,
            loading: false
        });
    }

    setupInfiniteScroll() {
        const sentinel = document.getElementById('infinite-scroll-sentinel');
        if (!sentinel) return;

        this.observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && this.state.page < this.state.totalPages && !this.state.loading) {
                this.setState({ page: this.state.page + 1 });
                this.loadDresses(true);
            }
        });
        this.observer.observe(sentinel);
    }

    template() {
        const categories = ['All', 'Blazer', 'Pencil', 'Maxi', 'Wrap', 'Party', 'Casual', 'Formal', 'Sheath'];
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        const hash = window.location.hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(hash);
        const isScanResult = urlParams.get('scan') === 'success';

        return `
            <div class="shop-page-wrapper fade-in">
                <!-- Unsplash-style Horizontal Strip -->
                <div class="category-strip-container sticky">
                    <div class="container">
                        <ul class="category-strip">
                            ${categories.map(c => `
                                <li class="${this.state.category === c.toLowerCase() ? 'active' : ''}" 
                                    onclick="window.shop.setCategory('${c.toLowerCase()}')">${c}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div class="shop-container container">
                    ${isScanResult ? `
                        <div class="perfect-fit-banner-minimal slide-up">
                            <h2>YOUR PERFECT SIZE: <span class="accent">${this.state.size}</span></h2>
                            <p>Showing curated dresses matching your unique body scan.</p>
                        </div>
                    ` : ''}

                    <div class="shop-filter-bar container">
                        <div class="filter-controls">
                            <div class="size-pills">
                                ${sizes.map(s => `
                                    <button class="size-pill ${this.state.size === s ? 'active' : ''}" 
                                        onclick="window.shop.setSize('${s}')">${s}</button>
                                `).join('')}
                            </div>
                            
                            <select class="minimal-select" onchange="window.shop.setSort(this.value)">
                                <option value="newest" ${this.state.sort === 'newest' ? 'selected' : ''}>Latest Arrivals</option>
                                <option value="price_low" ${this.state.sort === 'price_low' ? 'selected' : ''}>Price: Low to High</option>
                                <option value="price_high" ${this.state.sort === 'price_high' ? 'selected' : ''}>Price: High to Low</option>
                                <option value="popular" ${this.state.sort === 'popular' ? 'selected' : ''}>Top Rated</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="gallery-grid-container">
                        <div class="gallery-grid slide-up">
                            ${this.state.dresses.map((d, i) => this.renderDressCard(d, i)).join('')}
                        </div>
                        ${this.state.loading ? '<div class="gallery-loader"><i class="fas fa-spinner fa-spin"></i> Finding more styles...</div>' : ''}
                        <div id="infinite-scroll-sentinel" style="height: 100px;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async setCategory(category) {
        this.setState({ category, dresses: [], page: 1 });
        await this.loadDresses();
    }

    async setSize(size) {
        const newSize = this.state.size === size ? '' : size;
        this.setState({ size: newSize, dresses: [], page: 1 });
        await this.loadDresses();
    }

    async setSort(sort) {
        this.setState({ sort, dresses: [], page: 1 });
        await this.loadDresses();
    }

    afterRender() {
        window.shop = this; // Expose for onclick handlers simplified
        super.afterRender();
    }

    renderDressCard(dress, index = 0) {
        const staggerClass = index < 8 ? `stagger-${(index % 4) + 1}` : '';
        const hash = window.location.hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(hash);
        const isScanResult = urlParams.get('scan') === 'success';

        return `
            <div class="dress-card ${staggerClass}" data-id="${dress.id}">
                <a href="/product?id=${dress.id}" data-link class="dress-image-wrapper">
                    <img src="${dress.image}" alt="${dress.name}" loading="lazy" 
                        onerror="this.src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'">
                    <div class="card-badges">
                        ${dress.discount ? `<span class="badge-minimal">${dress.discount} OFF</span>` : ''}
                        ${dress.freeDelivery ? `<span class="badge-minimal badge-free">Free Delivery</span>` : ''}
                    </div>
                    ${isScanResult ? `<div class="perfect-fit-tag"><i class="fas fa-check"></i> PERFECT FIT</div>` : ''}
                </a>
                
                <div class="dress-card-info">
                    <div class="dress-card-meta">
                        <span class="dress-card-rating">
                            <i class="fas fa-star"></i> ${dress.rating} (${dress.reviews})
                        </span>
                    </div>
                    <a href="/product?id=${dress.id}" data-link class="dress-card-title">${dress.name}</a>
                    <span class="dress-card-price">$${dress.price.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    addToCart(dress) {
        store.addToCart(dress);
        alert('Added to cart!');
    }
}
