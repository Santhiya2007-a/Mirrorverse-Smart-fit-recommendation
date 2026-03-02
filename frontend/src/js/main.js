import Router from './Router.js';
import Home from './pages/Home.js';
import Shop from './pages/Shop.js';
import SmartFit from './pages/SmartFit.js';
import ProductDetails from './pages/ProductDetails.js';
import Cart from './pages/Cart.js';
import Profile from './pages/Profile.js';

const routes = [
    { path: '/', view: Home },
    { path: '/shop', view: Shop },
    { path: '/smart-fit', view: SmartFit },
    { path: '/product', view: ProductDetails },
    { path: '/cart', view: Cart },
    { path: '/profile', view: Profile }
];

document.addEventListener('DOMContentLoaded', () => {
    new Router(routes);
});
