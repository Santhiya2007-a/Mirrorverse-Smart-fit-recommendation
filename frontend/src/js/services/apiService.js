const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
    async getDresses(params = {}) {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/dresses?${query}`);
        return response.json();
    },

    async getDress(id) {
        const response = await fetch(`${API_BASE_URL}/dresses/${id}`);
        return response.json();
    },

    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`);
        return response.json();
    },

    async processScan(measurements) {
        const response = await fetch(`${API_BASE_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurements)
        });
        return response.json();
    }
};
