import Component from '../base/Component.js';
import { store } from '../store.js';

export default class Header extends Component {
    constructor(containerId, props = {}) {
        super(containerId, props);
        store.subscribe(() => this.updateCartCount());
    }
    template() {
        return `
            <header class="main-header sticky">
                <div class="header-container container">
                    <div class="logo">
                        <a href="/" data-link>Mirrorverse<span class="dot">.</span></a>
                    </div>
                    
                    <div class="header-search">
                        <div class="search-input-wrapper">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search for dresses, styles..." id="header-search-input">
                        </div>
                    </div>

                    <nav class="main-nav">
                        <ul>
                            <li><a href="/shop" data-link>Explore</a></li>
                            <li><a href="/smart-fit" class="nav-scan-link" data-link><i class="fas fa-camera"></i> Scan</a></li>
                            <li><a href="/cart" class="header-cart-icon" data-link>
                                <i class="fas fa-shopping-bag"></i>
                                <span id="header-cart-count" class="cart-count">${store.getState().cart.length}</span>
                            </a></li>
                            <li><a href="/profile" data-link><i class="far fa-user"></i></a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }
    afterRender() {
        const searchInput = document.getElementById('header-search-input');
        if (searchInput) {
            searchInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    window.router.navigateTo(`/shop?search=${encodeURIComponent(query)}`);
                }
            };
        }
    }

    updateCartCount() {
        const countEl = document.getElementById('header-cart-count');
        if (countEl) {
            countEl.innerText = store.getState().cart.length;
        }
    }
}
