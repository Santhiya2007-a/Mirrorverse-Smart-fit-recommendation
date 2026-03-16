document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

async function initCheckout() {
    const listContainer = document.getElementById('checkout-items-list');
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');

    // Parse URL to check if it's a "Buy Now" for a single item
    const urlParams = new URLSearchParams(window.location.search);
    const buyNowId = urlParams.get('buynow');

    let itemsToBuy = [];
    if (buyNowId) {
        itemsToBuy = [buyNowId];
    } else {
        itemsToBuy = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];
    }

    if (itemsToBuy.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    try {
        let products = [];
        try {
            const res = await fetch('http://localhost:5000/api/dresses');
            if (res.ok) {
                const result = await res.json();
                products = result.data;
            }
        } catch (e) {
            console.log("API not available, falling back to static JSON...");
        }

        if (!products.length) {
            const response = await fetch('frontend/data/products.json?v=' + Date.now());
            products = await response.json();
        }
        
        let cartItems = [];
        const counts = {};
        itemsToBuy.forEach(id => counts[id] = (counts[id] || 0) + 1);

        Object.keys(counts).forEach(id => {
            const product = products.find(p => p.id == id); // Loose equality allows for str matching
            if (product) {
                cartItems.push({ ...product, quantity: counts[id] });
            }
        });

        if (cartItems.length === 0) {
            listContainer.innerHTML = '<p>No items found.</p>';
            return;
        }

        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        listContainer.innerHTML = cartItems.map(item => `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <div style="font-weight: 700; color: #0f1111; font-size: 1.05rem; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: #B12704; font-weight: 700; font-size: 1.15rem; margin-bottom: 4px;">₹${item.price.toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.85rem; color: #565959;">Qty: <b>${item.quantity}</b></div>
                    <div style="font-size: 0.85rem; color: #565959;">Sold by: Mirrorverse Elite Store</div>
                    <div style="color: #007185; font-size: 0.85rem; margin-top: 6px; font-weight: 600;">FREE Guaranteed Delivery: Tomorrow</div>
                </div>
            </div>
        `).join('');

        const formattedTotal = '₹' + subtotal.toLocaleString('en-IN');
        summaryItems.innerText = formattedTotal;
        summaryTotal.innerText = formattedTotal;

    } catch (err) {
        console.error("Error loading checkout items", err);
        listContainer.innerHTML = '<p>Error loading items.</p>';
    }
}

function placeOrder() {
    // Show success overlay instead of standard alert
    document.getElementById('order-success').style.display = 'flex';
    
    // Clear cart if this was a normal cart checkout (not a "?buynow" shortcut)
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('buynow')) {
        localStorage.removeItem('mirrorverse_cart');
    }
}
