import Header from './components/Header.js';
import Footer from './components/Footer.js';

export default class Router {
    constructor(routes) {
        this.routes = routes;
        window.addEventListener('hashchange', () => this.handleRoute());
        document.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigateTo(path);
            }
        });

        // Initial load
        if (!window.location.hash) {
            window.location.hash = '#/';
        }
        this.handleRoute();
    }

    navigateTo(url) {
        window.location.hash = `#${url}`;
    }

    async handleRoute() {
        // Strip the # and look up the route (e.g. #/shop -> /shop)
        const hashPath = window.location.hash.slice(1) || '/';
        // Handle query params in hash: #/shop?size=M
        const [path, queryString] = hashPath.split('?');

        let route = this.routes.find(r => r.path === path);

        if (!route) {
            route = this.routes.find(r => r.path === '/');
        }

        // Render Layout only once
        const headerEl = document.getElementById('header');
        if (headerEl && !headerEl.innerHTML) {
            const header = new Header('header');
            header.render();

            const footer = new Footer('footer');
            footer.render();
        }

        console.log(`Routing to: ${path}`);
        const view = new route.view('main-content');
        await view.render();
        window.scrollTo(0, 0);
    }
}
