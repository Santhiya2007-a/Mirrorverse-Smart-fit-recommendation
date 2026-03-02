import Component from '../base/Component.js';

export default class Home extends Component {
    template() {
        const { detectedSize } = store.getState();

        return `
            <div class="home-unsplash fade-in">
                <section class="hero-full">
                    <div class="hero-bg">
                        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" alt="Fashion Hero">
                    </div>
                    <div class="hero-overlay-minimal">
                        <div class="hero-text-container">
                            <h1 class="hero-title-main">Mirrorverse</h1>
                            <p class="hero-subtitle">
                                ${detectedSize ? `Welcome back! Your AI Profile for Size <strong>${detectedSize}</strong> is ready.` : 'The first AI dress shopping experience that fits you personally using your unique body geometry.'}
                            </p>
                            <div class="hero-cta-group">
                                ${detectedSize ? `
                                    <a href="/shop?size=${detectedSize}&scan=success" class="btn btn-white btn-xl" data-link>SHOP MY SIZE</a>
                                ` : `
                                    <a href="/smart-fit" class="btn btn-white btn-xl" data-link>START AI SCAN</a>
                                `}
                                <a href="/shop" class="btn btn-outline-white btn-xl" data-link>EXPLORE ALL</a>
                            </div>
                        </div>
                    </div>
                </section>
                
                ${detectedSize ? `
                    <section class="personalized-picks container fade-in">
                        <div class="gallery-intro">
                            <h2>Perfect For Your Silhouette</h2>
                            <p>Hand-picked designs curated specifically for your <strong>Size ${detectedSize}</strong> profile.</p>
                        </div>
                        <div class="collection-strip">
                            <a href="/shop?size=${detectedSize}&category=blazer" class="collection-item">
                                <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"></div>
                                <h3>The Tailored Fit</h3>
                            </a>
                            <a href="/shop?size=${detectedSize}&category=pencil" class="collection-item">
                                <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1544022613-e87ce7526ed1?w=600"></div>
                                <h3>Modern Pencil</h3>
                            </a>
                            <a href="/shop?size=${detectedSize}" class="collection-item">
                                <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600"></div>
                                <h3>Boho Fusion</h3>
                            </a>
                        </div>
                        <div class="view-all-cta">
                            <a href="/shop?size=${detectedSize}&scan=success" class="btn btn-primary" data-link>BROWSE ALL ${detectedSize} DRESSES</a>
                        </div>
                    </section>
                ` : ''}

                <section class="home-galleries container">
                    <div class="gallery-intro">
                        <h2>Discover Your Aesthetic</h2>
                        <p>Curated collections for every occasion, from midnight parties to corporate elegance.</p>
                    </div>
                    
                    <div class="collection-strip">
                        <a href="/shop?category=maxi" class="collection-item">
                            <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1594968142999-d46e27b92bd3?auto=format&fit=crop&q=80&w=600"></div>
                            <h3>Maxi Sets</h3>
                        </a>
                        <a href="/shop?category=party" class="collection-item">
                            <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1566160983935-709fbcce4d3f?auto=format&fit=crop&q=80&w=600"></div>
                            <h3>Party Wear</h3>
                        </a>
                        <a href="/shop?category=formal" class="collection-item">
                            <div class="collection-img img-reveal"><img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600"></div>
                            <h3>Executive</h3>
                        </a>
                    </div>
                </section>
            </div>
        `;
    }
}
