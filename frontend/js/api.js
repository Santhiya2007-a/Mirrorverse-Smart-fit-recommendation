/* Mirrorverse API Service */

const BASE_URL = 'http://localhost:5000/api';

export const api = {
    async getProducts(gender = null, category = null, search = null) {
        let url = `${BASE_URL}/products?`;
        if (gender) url += `gender=${gender}&`;
        if (category) url += `category=${category}&`;
        if (search) url += `search=${search}&`;

        const response = await fetch(url);
        return response.json();
    },

    async getProduct(id) {
        const response = await fetch(`${BASE_URL}/products/${id}`);
        return response.json();
    },

    async scanBody(measurements) {
        const response = await fetch(`${BASE_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurements)
        });
        return response.json();
    },

    async getRecommendations(gender, size) {
        const response = await fetch(`${BASE_URL}/recommendations/${gender}/${size}`);
        return response.json();
    },

    async getUserProfile() {
        const response = await fetch(`${BASE_URL}/users/profile`);
        return response.json();
    }
};
