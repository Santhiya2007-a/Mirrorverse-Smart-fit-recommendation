/* Mirrorverse API Service - Women's Dresses Edition */

const BASE_URL = 'http://localhost:5000/api';

export const api = {
    // ============== DRESS ENDPOINTS ==============
    
    async getDresses(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.size) queryParams.append('size', params.size);
        if (params.category) queryParams.append('category', params.category);
        if (params.color) queryParams.append('color', params.color);
        if (params.search) queryParams.append('search', params.search);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.min_price) queryParams.append('min_price', params.min_price);
        if (params.max_price) queryParams.append('max_price', params.max_price);
        
        const url = `${BASE_URL}/dresses?${queryParams.toString()}`;
        const response = await fetch(url);
        return response.json();
    },

    getProducts(params) {
        return this.getDresses(params);
    },

    async getDress(id) {
        const response = await fetch(`${BASE_URL}/dresses/${id}`);
        return response.json();
    },

    async getDressesByCategory(category, page = 1) {
        const response = await fetch(`${BASE_URL}/dresses/category/${category}?page=${page}`);
        return response.json();
    },

    async getDressesBySize(size, params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.sort) queryParams.append('sort', params.sort);
        
        const url = `${BASE_URL}/dresses/size/${size}?${queryParams.toString()}`;
        const response = await fetch(url);
        return response.json();
    },

    async searchDresses(query, page = 1) {
        const response = await fetch(`${BASE_URL}/dresses/search?q=${encodeURIComponent(query)}&page=${page}`);
        return response.json();
    },

    async getCategories() {
        const response = await fetch(`${BASE_URL}/categories`);
        return response.json();
    },

    async getColors() {
        const response = await fetch(`${BASE_URL}/dresses/colors`);
        return response.json();
    },

    // ============== RECOMMENDATIONS ==============

    async getTrendingDresses(page = 1) {
        const response = await fetch(`${BASE_URL}/recommendations/trending?page=${page}`);
        return response.json();
    },

    async getNewDresses(page = 1) {
        const response = await fetch(`${BASE_URL}/recommendations/new?page=${page}`);
        return response.json();
    },

    async getRecommendationsBySize(size, params = {}) {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.sort) queryParams.append('sort', params.sort);
        
        const url = `${BASE_URL}/recommendations/size/${size}?${queryParams.toString()}`;
        const response = await fetch(url);
        return response.json();
    },

    async getRecommendationsByCategory(category, page = 1) {
        const response = await fetch(`${BASE_URL}/recommendations/category/${category}?page=${page}`);
        return response.json();
    },

    // ============== SMART FIT SCAN ==============

    async scanBody(measurements) {
        const response = await fetch(`${BASE_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurements)
        });
        return response.json();
    },

    async getSizeGuide() {
        const response = await fetch(`${BASE_URL}/scan/size-guide`);
        return response.json();
    },

    // ============== CART & ORDERS ==============

    async getUserProfile() {
        const response = await fetch(`${BASE_URL}/users/profile`);
        return response.json();
    },

    async updateCart(items) {
        const response = await fetch(`${BASE_URL}/users/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        });
        return response.json();
    }
};
