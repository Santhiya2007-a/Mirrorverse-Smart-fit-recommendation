import Component from '../base/Component.js';

export default class Footer extends Component {
    template() {
        return `
            <div class="footer-container container">
                <div class="footer-grid">
                    <div class="footer-section about">
                        <h3>Mirrorverse</h3>
                        <p>The first AI-powered dress marketplace designed to find your perfect fit, every time.</p>
                    </div>
                    <div class="footer-section links">
                        <h4>Shop</h4>
                        <ul>
                            <li><a href="/shop?category=maxi" data-link>Maxi Dresses</a></li>
                            <li><a href="/shop?category=party" data-link>Party Wear</a></li>
                            <li><a href="/shop?category=formal" data-link>Formal</a></li>
                        </ul>
                    </div>
                    <div class="footer-section contact">
                        <h4>Support</h4>
                        <ul>
                            <li>Help Center</li>
                            <li>Returns</li>
                            <li>Shipping Info</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    &copy; 2026 Mirrorverse AI. All rights reserved.
                </div>
            </div>
        `;
    }
}
