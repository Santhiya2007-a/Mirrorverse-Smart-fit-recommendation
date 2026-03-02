import Component from '../base/Component.js';
import { apiService } from '../services/apiService.js';
import { store } from '../store.js';

export default class ProductDetails extends Component {
    constructor(containerId, props = {}) {
        super(containerId, props);
        this.state = {
            dress: null,
            loading: true
        };
    }

    async afterRender() {
        const hash = window.location.hash.split('?')[1] || '';
        const urlParams = new URLSearchParams(hash);
        const id = urlParams.get('id');

        if (id) {
            const dress = await apiService.getDress(id);
            this.setState({ dress, loading: false });
        }
    }

    template() {
        if (this.state.loading) return '<div class="loader">Loading product...</div>';
        const d = this.state.dress;
        const detectedSize = store.getState().detectedSize;

        return `
            <div class="product-details container fade-in">
                <div class="product-visuals img-reveal">
                    <img src="${d.image}" alt="${d.name}" class="main-img" onerror="this.src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'">
                </div>
                
                <div class="product-info">
                    <nav class="breadcrumb">
                        <a href="/shop" data-link>Shop</a> / ${d.category}
                    </nav>
                    
                    <h1 class="hero-title">${d.name}</h1>
                    
                    <div class="price-section">
                        <span class="price">$${d.price.toFixed(2)}</span>
                        ${d.originalPrice ? `<span class="original-price">$${d.originalPrice.toFixed(2)}</span>` : ''}
                        ${d.discount ? `<span class="discount-label">${d.discount} OFF</span>` : ''}
                    </div>

                    <div class="rating-section">
                        <span class="stars"><i class="fas fa-star"></i> ${d.rating}</span>
                        <span class="review-count">(${d.reviews} REVIEWS)</span>
                    </div>

                    <div class="size-selection">
                        <h4>SELECT YOUR SIZE:</h4>
                        <div class="size-options">
                            ${d.sizes.map(s => `
                                <button class="size-chip ${detectedSize === s ? 'perfect-fit' : ''} ${this.state.selectedSize === s ? 'active' : ''}" 
                                        onclick="window.productDetails.setSize('${s}')">
                                    ${s}
                                    ${detectedSize === s ? '<i class="fas fa-check-circle"></i>' : ''}
                                </button>
                            `).join('')}
                        </div>
                        ${detectedSize ? `
                            <p class="fit-tip"><i class="fas fa-magic"></i> Size ${detectedSize} is recommended based on your body scan.</p>
                        ` : ''}
                    </div>

                    <div class="actions">
                        <button class="btn btn-primary add-to-cart-big" onclick="window.productDetails.addItem()">ADD TO BAG</button>
                    </div>

                    <div class="description-section">
                        <h3>PRODUCT DESCRIPTION</h3>
                        <p>${d.description || `This elegant ${d.category} dress is designed for ultimate comfort and high-fashion impact.`}</p>
                    </div>
                </div>
            </div>
        `;
    }

    setSize(selectedSize) {
        this.setState({ selectedSize });
    }

    addItem() {
        if (!this.state.selectedSize) {
            alert('Please select a size first.');
            return;
        }
        store.addToCart({ ...this.state.dress, selectedSize: this.state.selectedSize });
        alert('Added to cart!');
    }

    afterRender() {
        window.productDetails = this;
        super.afterRender();
    }
}
