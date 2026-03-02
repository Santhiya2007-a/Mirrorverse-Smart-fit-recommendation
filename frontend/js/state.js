/* Mirrorverse Global State */

class State {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('mirror_cart')) || [];
        this.user = JSON.parse(localStorage.getItem('mirror_user')) || null;
        this.size = localStorage.getItem('mirror_size') || null;
        this.gender = localStorage.getItem('mirror_gender') || 'Women';
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(l => l(this));
        localStorage.setItem('mirror_cart', JSON.stringify(this.cart));
        localStorage.setItem('mirror_size', this.size);
        localStorage.setItem('mirror_gender', this.gender);
    }

    addToCart(product) {
        const exists = this.cart.find(item => item.id === product.id);
        if (exists) {
            exists.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.notify();
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.notify();
    }

    setSize(size) {
        this.size = size;
        this.notify();
    }

    setGender(gender) {
        this.gender = gender;
        this.notify();
    }

    getCartCount() {
        return this.cart.reduce((acc, item) => acc + item.quantity, 0);
    }
}

export const state = new State();
