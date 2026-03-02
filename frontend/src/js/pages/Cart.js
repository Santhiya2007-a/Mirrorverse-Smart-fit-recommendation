import Component from '../base/Component.js';
import { store } from '../store.js';

export default class Cart extends Component {
    constructor(containerId, props = {}) {
        super(containerId, props);
        this.unsubscribe = store.subscribe(() => this.render());
    }

    template() {
        const { cart } = store.getState();
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cart.length === 0) {
            return `
                <div class="empty-cart container fade-in">
                    <i class="fas fa-shopping-bag large-icon"></i>
                    <h2>YOUR BAG IS EMPTY</h2>
                    <p>Discover our latest collections and find your perfect fit.</p>
                    <a href="/shop" class="btn btn-primary btn-lg" data-link>EXPLORE GALLERY</a>
                </div>
            `;
        }

        return `
            <div class="cart-page container fade-in">
                <div class="cart-items">
                    <h1>SHOPPING BAG</h1>
                    ${cart.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300'">
                            <div class="item-details">
                                <div class="item-header">
                                    <div class="item-main">
                                        <h3>${item.name}</h3>
                                        <p class="item-meta">Size: ${item.selectedSize || 'Standard'}</p>
                                    </div>
                                    <p class="item-price">$${item.price.toFixed(2)}</p>
                                </div>
                                <div class="item-footer">
                                    <button class="remove-btn" onclick="store.removeFromCart('${item.id}')">REMOVE ITEM</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cart-summary">
                    <h3>ORDER SUMMARY</h3>
                    <div class="summary-row">
                        <span>SUBTOTAL</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>SHIPPING</span>
                        <span>FREE</span>
                    </div>
                    <div class="summary-row">
                        <span>ESTIMATED TAX</span>
                        <span>$0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>ORDER TOTAL</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary checkout-btn" onclick="alert('Proceeding to secure checkout...')">SECURE CHECKOUT</button>
                    <p class="secure-checkout-hint"><i class="fas fa-lock"></i> 100% Encrypted & Secure Checkout</p>
                </div>
            </div>
        `;
    }
}
