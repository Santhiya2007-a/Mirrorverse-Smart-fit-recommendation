import Component from '../base/Component.js';
import { store } from '../store.js';

export default class Profile extends Component {
    template() {
        const { user, detectedSize } = store.getState();

        return `
            <div class="profile-page container fade-in">
                <header class="profile-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-meta">
                        <h1>${user ? user.username.toUpperCase() : 'PERSONAL PROFILE'}</h1>
                        <p>${user ? user.email.toLowerCase() : 'GUEST SESSION'}</p>
                    </div>
                </header>

                <div class="profile-grid">
                    <section class="profile-section">
                        <h3><i class="fas fa-magic"></i> AI SMART FIT® STATS</h3>
                        <div class="detected-size-box">
                            ${detectedSize ? `
                                <span class="label">RECOMMENDED SIZE</span>
                                <span class="value">${detectedSize}</span>
                                <p class="scan-note">Body geometry analyzed today</p>
                                <a href="/smart-fit" class="btn btn-outline-dark btn-block" data-link>RESCAN BODY</a>
                            ` : `
                                <span class="label">NO DATA FOUND</span>
                                <p class="scan-note">Analyze your body to unlock personalized sizing.</p>
                                <a href="/smart-fit" class="btn btn-primary btn-block" data-link>START AI SCAN</a>
                            `}
                        </div>
                    </section>

                    <section class="profile-section">
                        <h3><i class="fas fa-shopping-bag"></i> RECENT PURCHASES</h3>
                        <div class="empty-msg">
                            <p>You haven't placed any orders yet.</p>
                        </div>
                        <a href="/shop" class="btn btn-outline-dark btn-block" data-link>SHOP NEW COLLECTION</a>
                    </section>
                </div>
            </div>
        `;
    }
}
