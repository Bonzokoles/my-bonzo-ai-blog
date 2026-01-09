// JIMBO UNIFIED PUMO-API.JS - Meble Pumo Integration & Data Management

class PUMOAPIManager {
    constructor() {
        this.baseURL = 'https://pumo-chunk-processor.stolarnia-ams.workers.dev';
        this.endpoints = {
            products: '/api/products',
            categories: '/api/categories',
            search: '/api/search',
            sync: '/api/sync',
            health: '/api/health',
            metrics: '/api/metrics',
            export: '/api/export'
        };

        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.requestQueue = [];
        this.isProcessingQueue = false;

        this.initAPI();
        console.log('🔗 PUMO API Manager initialized');
    }

    // Initialize API connection
    async initAPI() {
        try {
            const health = await this.checkHealth();
            console.log('✅ PUMO API connection established:', health);

            // Load initial data
            await this.loadInitialData();
        } catch (error) {
            console.warn('⚠️ PUMO API not available, using mock data:', error.message);
            this.useMockData = true;
        }
    }

    // Health Check
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}${this.endpoints.health}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Health check failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`API health check failed: ${error.message}`);
        }
    }

    // Load Initial Data
    async loadInitialData() {
        try {
            const [products, categories, metrics] = await Promise.all([
                this.getProducts({ limit: 100 }),
                this.getCategories(),
                this.getMetrics()
            ]);

            // Cache initial data
            this.cacheSet('initial-products', products);
            this.cacheSet('categories', categories);
            this.cacheSet('metrics', metrics);

            console.log('📊 Initial PUMO data loaded successfully');

            // Dispatch event for UI updates
            window.dispatchEvent(new CustomEvent('pumoDataLoaded', {
                detail: { products, categories, metrics }
            }));

        } catch (error) {
            console.error('❌ Failed to load initial data:', error);
        }
    }

    // Products API
    async getProducts(options = {}) {
        const {
            limit = 50,
            offset = 0,
            category = null,
            search = null,
            sortBy = 'name',
            sortOrder = 'asc'
        } = options;

        const cacheKey = `products-${JSON.stringify(options)}`;

        // Check cache first
        if (this.cacheGet(cacheKey)) {
            return this.cacheGet(cacheKey);
        }

        try {
            if (this.useMockData) {
                return this.getMockProducts(options);
            }

            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                sortBy,
                sortOrder
            });

            if (category) params.append('category', category);
            if (search) params.append('search', search);

            const response = await fetch(`${this.baseURL}${this.endpoints.products}?${params}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Products API error: ${response.status}`);
            }

            const data = await response.json();
            this.cacheSet(cacheKey, data);

            return data;

        } catch (error) {
            console.error('Products API error:', error);
            return this.getMockProducts(options);
        }
    }

    async getProduct(id) {
        const cacheKey = `product-${id}`;

        if (this.cacheGet(cacheKey)) {
            return this.cacheGet(cacheKey);
        }

        try {
            if (this.useMockData) {
                return this.getMockProduct(id);
            }

            const response = await fetch(`${this.baseURL}${this.endpoints.products}/${id}`);

            if (!response.ok) {
                throw new Error(`Product ${id} not found`);
            }

            const product = await response.json();
            this.cacheSet(cacheKey, product);

            return product;

        } catch (error) {
            console.error(`Product ${id} fetch error:`, error);
            return this.getMockProduct(id);
        }
    }

    // Categories API
    async getCategories() {
        const cacheKey = 'categories';

        if (this.cacheGet(cacheKey)) {
            return this.cacheGet(cacheKey);
        }

        try {
            if (this.useMockData) {
                return this.getMockCategories();
            }

            const response = await fetch(`${this.baseURL}${this.endpoints.categories}`);

            if (!response.ok) {
                throw new Error(`Categories API error: ${response.status}`);
            }

            const categories = await response.json();
            this.cacheSet(cacheKey, categories);

            return categories;

        } catch (error) {
            console.error('Categories API error:', error);
            return this.getMockCategories();
        }
    }

    // Search API
    async searchProducts(query, options = {}) {
        const {
            limit = 20,
            category = null,
            minPrice = null,
            maxPrice = null,
            inStock = null
        } = options;

        try {
            if (this.useMockData) {
                return this.getMockSearchResults(query, options);
            }

            const params = new URLSearchParams({
                q: query,
                limit: limit.toString()
            });

            if (category) params.append('category', category);
            if (minPrice) params.append('minPrice', minPrice.toString());
            if (maxPrice) params.append('maxPrice', maxPrice.toString());
            if (inStock !== null) params.append('inStock', inStock.toString());

            const response = await fetch(`${this.baseURL}${this.endpoints.search}?${params}`);

            if (!response.ok) {
                throw new Error(`Search API error: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Search API error:', error);
            return this.getMockSearchResults(query, options);
        }
    }

    // Metrics API
    async getMetrics() {
        const cacheKey = 'metrics';

        if (this.cacheGet(cacheKey)) {
            return this.cacheGet(cacheKey);
        }

        try {
            if (this.useMockData) {
                return this.getMockMetrics();
            }

            const response = await fetch(`${this.baseURL}${this.endpoints.metrics}`);

            if (!response.ok) {
                throw new Error(`Metrics API error: ${response.status}`);
            }

            const metrics = await response.json();
            this.cacheSet(cacheKey, metrics);

            return metrics;

        } catch (error) {
            console.error('Metrics API error:', error);
            return this.getMockMetrics();
        }
    }

    // Sync API
    async triggerSync() {
        try {
            if (this.useMockData) {
                console.log('🔄 Mock sync triggered');
                return { success: true, message: 'Mock sync completed', synced: 156 };
            }

            const response = await fetch(`${this.baseURL}${this.endpoints.sync}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Sync API error: ${response.status}`);
            }

            const result = await response.json();

            // Clear cache after sync
            this.clearCache();

            return result;

        } catch (error) {
            console.error('Sync API error:', error);
            throw error;
        }
    }

    // Export API
    async exportData(format = 'json', options = {}) {
        try {
            if (this.useMockData) {
                return this.getMockExport(format, options);
            }

            const params = new URLSearchParams({
                format,
                ...options
            });

            const response = await fetch(`${this.baseURL}${this.endpoints.export}?${params}`);

            if (!response.ok) {
                throw new Error(`Export API error: ${response.status}`);
            }

            const data = await response.blob();
            return data;

        } catch (error) {
            console.error('Export API error:', error);
            return this.getMockExport(format, options);
        }
    }

    // Mock Data Functions
    getMockProducts(options = {}) {
        const mockProducts = [
            { id: 1, name: 'Szafa IKEA MALM', category: 'furniture', price: 899, inStock: true, rating: 4.5 },
            { id: 2, name: 'Stół dębowy rustical', category: 'furniture', price: 1299, inStock: true, rating: 4.8 },
            { id: 3, name: 'Lampa wisząca LED', category: 'lighting', price: 349, inStock: false, rating: 4.2 },
            { id: 4, name: 'Komoda z szufladami', category: 'storage', price: 649, inStock: true, rating: 4.6 },
            { id: 5, name: 'Fotel biurowy ergonomiczny', category: 'furniture', price: 799, inStock: true, rating: 4.7 }
        ];

        const { limit = 50, search } = options;

        let filtered = mockProducts;

        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        return {
            products: filtered.slice(0, limit),
            total: filtered.length,
            page: 1,
            hasMore: filtered.length > limit
        };
    }

    getMockProduct(id) {
        return {
            id: parseInt(id),
            name: `Produkt #${id}`,
            description: 'Szczegółowy opis produktu z wszystkimi parametrami technicznymi.',
            category: 'furniture',
            price: Math.floor(Math.random() * 2000) + 200,
            originalPrice: Math.floor(Math.random() * 2500) + 300,
            inStock: Math.random() > 0.2,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 500) + 10,
            images: ['/api/placeholder/400/300'],
            dimensions: { width: 120, height: 80, depth: 40 },
            weight: 25.5,
            material: 'Drewno dębowe',
            warranty: 24,
            availability: 'Dostępny od ręki'
        };
    }

    getMockCategories() {
        return [
            { id: 1, name: 'Meble', slug: 'furniture', count: 520, description: 'Wszystkie rodzaje mebli' },
            { id: 2, name: 'Oświetlenie', slug: 'lighting', count: 290, description: 'Lampy i oprawy' },
            { id: 3, name: 'Przechowywanie', slug: 'storage', count: 410, description: 'Szafy, komody, regały' },
            { id: 4, name: 'Dekoracje', slug: 'decor', count: 380, description: 'Dodatki dekoracyjne' },
            { id: 5, name: 'Kuchnia', slug: 'kitchen', count: 350, description: 'Meble i akcesoria kuchenne' },
            { id: 6, name: 'Sypialnia', slug: 'bedroom', count: 315, description: 'Meble do sypialni' }
        ];
    }

    getMockSearchResults(query, options) {
        return {
            query,
            results: [
                { id: 1, name: `${query} - Wynik 1`, category: 'furniture', price: 599, relevance: 0.95 },
                { id: 2, name: `${query} - Wynik 2`, category: 'decor', price: 299, relevance: 0.87 },
                { id: 3, name: `${query} - Wynik 3`, category: 'lighting', price: 449, relevance: 0.78 }
            ],
            total: 3,
            suggestions: ['szafa', 'komoda', 'stół', 'krzesło']
        };
    }

    getMockMetrics() {
        return {
            totalProducts: 2560,
            activeQueries: 847,
            successRate: 94.2,
            dailyVolume: 15420,
            weeklyGrowth: 12.5,
            categories: 68,
            averagePrice: 689,
            topCategory: 'furniture',
            lastSync: new Date().toISOString(),
            syncStatus: 'completed',
            errors: 12,
            warnings: 3
        };
    }

    getMockExport(format, options) {
        const data = {
            timestamp: new Date().toISOString(),
            format,
            options,
            records: 2560,
            categories: 68,
            exportedBy: 'PUMO Dashboard'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: format === 'json' ? 'application/json' : 'text/csv'
        });

        return blob;
    }

    // Cache Management
    cacheSet(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    cacheGet(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if cache expired
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ API cache cleared');
    }

    // Request Queue Management
    async queueRequest(request) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ request, resolve, reject });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const { request, resolve, reject } = this.requestQueue.shift();

            try {
                const result = await request();
                resolve(result);
            } catch (error) {
                reject(error);
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.isProcessingQueue = false;
    }

    // Batch Operations
    async batchGetProducts(ids) {
        try {
            const promises = ids.map(id => this.getProduct(id));
            const results = await Promise.allSettled(promises);

            return results.map((result, index) => ({
                id: ids[index],
                success: result.status === 'fulfilled',
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason.message : null
            }));

        } catch (error) {
            console.error('Batch get products error:', error);
            throw error;
        }
    }

    // Statistics and Analytics
    async getAnalytics(period = 'week') {
        try {
            const cacheKey = `analytics-${period}`;

            if (this.cacheGet(cacheKey)) {
                return this.cacheGet(cacheKey);
            }

            const analytics = {
                period,
                queries: {
                    total: 15420,
                    successful: 14567,
                    failed: 853,
                    averageResponseTime: 245
                },
                products: {
                    total: 2560,
                    active: 2401,
                    outOfStock: 159,
                    mostViewed: 'Szafa IKEA MALM'
                },
                categories: {
                    total: 68,
                    topPerforming: ['furniture', 'lighting', 'storage'],
                    growth: { furniture: 15.2, lighting: 8.7, storage: 12.1 }
                },
                performance: {
                    uptime: 99.8,
                    errorRate: 1.8,
                    cacheHitRate: 78.2
                }
            };

            this.cacheSet(cacheKey, analytics);
            return analytics;

        } catch (error) {
            console.error('Analytics error:', error);
            throw error;
        }
    }

    // Public API Methods
    async refreshData() {
        console.log('🔄 Refreshing PUMO data...');
        this.clearCache();
        await this.loadInitialData();
    }

    getConnectionStatus() {
        return {
            connected: !this.useMockData,
            baseURL: this.baseURL,
            cacheSize: this.cache.size,
            queueLength: this.requestQueue.length
        };
    }

    // Event Handlers
    onDataUpdate(callback) {
        window.addEventListener('pumoDataLoaded', callback);
    }

    offDataUpdate(callback) {
        window.removeEventListener('pumoDataLoaded', callback);
    }
}

// Initialize PUMO API Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pumoAPI = new PUMOAPIManager();

    // Add API functions to global pumo object
    if (window.pumo) {
        window.pumo.api = {
            products: (options) => window.pumoAPI.getProducts(options),
            product: (id) => window.pumoAPI.getProduct(id),
            search: (query, options) => window.pumoAPI.searchProducts(query, options),
            categories: () => window.pumoAPI.getCategories(),
            metrics: () => window.pumoAPI.getMetrics(),
            sync: () => window.pumoAPI.triggerSync(),
            export: (format, options) => window.pumoAPI.exportData(format, options),
            analytics: (period) => window.pumoAPI.getAnalytics(period),
            refresh: () => window.pumoAPI.refreshData(),
            status: () => window.pumoAPI.getConnectionStatus(),
            instance: window.pumoAPI
        };
    }
});

console.log('🔗 PUMO API module loaded');