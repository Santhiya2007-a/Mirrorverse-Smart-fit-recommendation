export default class Component {
    constructor(containerId, props = {}) {
        this.container = document.getElementById(containerId);
        this.props = props;
        this.state = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        if (this.container) {
            this.container.innerHTML = this.template();
            this.afterRender();
        }
    }

    template() {
        return '';
    }

    afterRender() { }
}
