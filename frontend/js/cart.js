import { state } from './state.js';

/* Mirrorverse Cart Module */

export function renderCart() {
    const container = document.getElementById('cart-items');
    const subtotalCount = document.getElementById('count-subtotal');
    const subtotalPrice = document.getElementById('total-subtotal');

    if (!container) return;

    const cart = state.cart;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 6rem 2rem; background: var(--white); border-radius: var(--border-radius); border: 1px solid var(--border);">
                <i class="fas fa-shopping-bag" style="font-size: 4rem; color: var(--border); margin-bottom: 2rem; display: block;"></i>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Your bag is empty</h3>
                <p style="color: var(--text-muted); max-width: 400px; margin: 0 auto 2rem;">Scan your body or browse our elite collections to find your perfect fit.</p>
                <a href="shop.html" class="btn btn-primary" style="width: auto;">Start Shopping</a>
            </div>
        `;
        if (subtotalCount) subtotalCount.innerText = "0";
        if (subtotalPrice) subtotalPrice.innerText = "₹0";
        return;
    }

    container.innerHTML = `<h2 style="font-size: 2rem; margin-bottom: 2rem; letter-spacing: -1px;">Your Bag</h2>` +
        cart.map(item => `
        <div style="display: flex; gap: 1.5rem; background: var(--white); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1.5rem; transition: transform 0.2s ease;">
            <img src="${item.image}" style="width: 120px; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; background: var(--bg);">
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">${item.name}</h3>
                <div style="color: var(--success); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;"><i class="fas fa-check-circle"></i> In Stock & Ready to Ship</div>
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">Size: <span style="color: var(--primary); font-weight: 600;">${state.size || 'Standard'}</span></div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 0.85rem; color: var(--text-muted);">Qty: ${item.quantity}</div>
                    <button class="remove-btn" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600;" data-id="${item.id}">Remove</button>
                    <button style="background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Save for later</button>
                </div>
            </div>
            <div style="font-weight: 800; font-size: 1.25rem; color: var(--primary); align-self: center;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (subtotalCount) subtotalCount.innerText = state.getCartCount();
    if (subtotalPrice) subtotalPrice.innerText = `₹${total.toLocaleString('en-IN')}`;

    // Add Remove Listeners
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            state.removeFromCart(parseInt(btn.dataset.id));
            renderCart();
        };
    });
}

// Auto-run if element exists
if (document.getElementById('cart-items')) {
    renderCart();
    state.subscribe(renderCart);
}
