export class PumoTracker {
    private endpoint = 'https://pumo-chunk-processor.stolarnia-ams.workers.dev/api/track';
    private clientId: string;

    constructor() {
        this.clientId = this.getClientId();
    }

    private getClientId(): string {
        if (typeof window === 'undefined') return 'server-side';
        
        let id = localStorage.getItem('pumo_client_id');
        if (!id) {
            // Simple UUID v4 replacement if crypto.randomUUID is not available
            id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('pumo_client_id', id);
        }
        return id;
    }

    /**
     * Generic event tracker
     */
    public async track(eventName: string, params: Record<string, any> = {}) {
        if (typeof window === 'undefined') return; // Don't run on server side

        try {
            // Non-blocking fetch (fire and forget)
            fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: eventName,
                    client_id: this.clientId,
                    params: {
                        ...params,
                        url: window.location.href,
                        referrer: document.referrer,
                        timestamp: new Date().toISOString()
                    }
                })
            }).catch(err => console.debug('Tracker fail:', err));
        } catch (e) {
            // Silently fail to not impact user experience
        }
    }

    /**
     * Track a product view
     */
    public trackProductView(product: { id: string; name: string; price: number; category?: string }) {
        this.track('view_item', {
            product_id: product.id,
            product_name: product.name,
            value: product.price,
            currency: 'PLN',
            category: product.category
        });
    }

    /**
     * Track a click on "Buy" or external link
     */
    public trackClick(product: { id: string; name: string; url: string }) {
        this.track('select_item', {
            product_id: product.id,
            product_name: product.name,
            destination_url: product.url
        });
    }

    /**
     * Track a guide view
     */
    public trackGuideView(guidePath: string, title: string) {
        this.track('page_view', {
            page_title: title,
            page_path: guidePath,
            content_type: 'guide'
        });
    }
}

// Singleton export
export const pumoTracker = new PumoTracker();
