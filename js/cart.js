// js/cart.js

let cart = JSON.parse(localStorage.getItem('mirrorverse_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  initCart();
});

async function initCart() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (cart.length === 0) {
    renderEmptyCart(container);
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

    renderCart(container, products);
  } catch (err) {
    console.error("Error loading cart products", err);
    container.innerHTML = '<p style="text-align:center; padding: 2rem;">Error loading cart items.</p>';
  }
}

function renderEmptyCart(container) {
  container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: white;">
            <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 10px;">Your Mirrorverse Cart is empty</h2>
            <p style="font-size: 14px; color: #565959; margin-bottom: 24px;">Shop today's deals and find your perfect fit.</p>
            <a href="shop.html" class="btn btn-primary" style="display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Shop Now</a>
        </div>
    `;
}

function renderCart(container, products) {
  // Cart is just an array of IDs now, convert to full objects with occurrences
  let cartItems = [];
  const counts = {};
  cart.forEach(id => counts[id] = (counts[id] || 0) + 1);

  Object.keys(counts).forEach(id => {
    const product = products.find(p => String(p.id) === String(id));
    if (product) {
      cartItems.push({ ...product, quantity: counts[id] });
    }
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cart.length;

  let itemsHTML = cartItems.map(item => `
        <div class="cart-item-amazon" style="background: white; padding: 16px; border-bottom: 1px solid var(--color-border); display: flex; gap: 16px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 130px; object-fit: cover; border-radius: 4px;">
            <div style="flex: 1;">
                <h3 style="font-size: 15px; font-weight: 500; color: #0f1111; margin-bottom: 4px;">${item.name}</h3>
                <div style="color: var(--color-success); font-size: 12px; font-weight: 700; margin-bottom: 4px;">In Stock</div>
                <div style="font-size: 13px; color: #565959; margin-bottom: 8px;">
                    Size: <b>M</b> | Qty: <b>${item.quantity}</b>
                </div>
                <div style="font-size: 18px; font-weight: 700; color: #0f1111; margin-bottom: 12px;">₹${item.price.toLocaleString('en-IN')}</div>
                <div style="display: flex; gap: 12px;">
                    <button onclick="removeFromCart('${item.id}')" style="background: #fff; border: 1px solid var(--color-border); padding: 6px 14px; border-radius: 8px; font-size: 12px; box-shadow: 0 2px 5px rgba(15,17,17,.15); cursor: pointer;">Delete</button>
                    <button style="background: #fff; border: 1px solid var(--color-border); padding: 6px 14px; border-radius: 8px; font-size: 12px; box-shadow: 0 2px 5px rgba(15,17,17,.15); cursor: pointer;">Save for later</button>
                </div>
            </div>
        </div>
    `).join('');

  container.innerHTML = `
        <div class="cart-subtotal-box" style="background: white; padding: 20px; border-bottom: 1px solid var(--color-border); margin-bottom: 12px;">
            <div style="font-size: 18px; color: #0f1111;">
                Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''}): <span style="font-weight: 700;">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button class="btn-checkout-amazon" onclick="window.location.href='checkout.html'" style="background: #FFD814; border: 1px solid #FCD200; border-radius: 8px; width: 100%; padding: 12px; font-weight: 500; margin-top: 12px; cursor: pointer;">Proceed to Checkout</button>
        </div>
        <div class="cart-items-list">
            ${itemsHTML}
        </div>
    `;
}

window.removeFromCart = function (productId) {
  // Remove all instances of this product for simplicity in this demo
  cart = cart.filter(id => id !== productId);
  localStorage.setItem('mirrorverse_cart', JSON.stringify(cart));
  initCart();
  if (typeof updateCartCount === 'function') updateCartCount();
};
