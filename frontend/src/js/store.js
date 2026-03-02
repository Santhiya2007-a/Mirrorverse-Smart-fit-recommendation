/* Store for global application state */
class Store {
    constructor() {
        this.state = {
            cart: JSON.parse(localStorage.getItem('mirrorverse_cart')) || [],
            user: JSON.parse(localStorage.getItem('mirrorverse_user')) || null,
            detectedSize: localStorage.getItem('mirrorverse_detected_size') || null
        };
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
        this.persist();
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    persist() {
        localStorage.setItem('mirrorverse_cart', JSON.stringify(this.state.cart));
        if (this.state.user) localStorage.setItem('mirrorverse_user', JSON.stringify(this.state.user));
        if (this.state.detectedSize) localStorage.setItem('mirrorverse_detected_size', this.state.detectedSize);
    }

    // Actions
    addToCart(product) {
        const cart = [...this.state.cart];
        const index = cart.findIndex(item => item.id === product.id);

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        this.setState({ cart });
    }

    removeFromCart(productId) {
        const cart = this.state.cart.filter(item => item.id !== productId);
        this.setState({ cart });
    }

    setDetectedSize(size) {
        this.setState({ detectedSize: size });
    }
}

export const store = new Store();
