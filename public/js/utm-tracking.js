/**
 * UTM Click Tracking Script
 * Automatically tracks clicks on UTM-tagged links
 * Add to pages where you want to track UTM clicks
 */

// UTM Click Tracking Configuration
const UTM_TRACKING_CONFIG = {
    endpoint: '/api/analytics/utm-tracking',
    debug: true, // Set to false in production
    trackAllLinks: true, // Track all external links, not just UTM
    trackInternalLinks: false // Track internal UTM links
};

/**
 * Parse UTM parameters from URL
 */
function parseUTMParams(url) {
    const urlObj = new URL(url);
    return {
        utm_source: urlObj.searchParams.get('utm_source'),
        utm_medium: urlObj.searchParams.get('utm_medium'),
        utm_campaign: urlObj.searchParams.get('utm_campaign'),
        utm_term: urlObj.searchParams.get('utm_term'),
        utm_content: urlObj.searchParams.get('utm_content')
    };
}

/**
 * Check if link has UTM parameters
 */
function hasUTMParams(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.has('utm_source') ||
            urlObj.searchParams.has('utm_medium') ||
            urlObj.searchParams.has('utm_campaign');
    } catch {
        return false;
    }
}

/**
 * Track UTM click event
 */
async function trackUTMClick(url, element) {
    const utmParams = parseUTMParams(url);

    const payload = {
        url: url,
        ...utmParams,
        element_text: element?.textContent?.trim().substring(0, 100),
        element_id: element?.id,
        element_class: element?.className
    };

    try {
        const response = await fetch(UTM_TRACKING_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (UTM_TRACKING_CONFIG.debug) {
            if (response.ok) {
                console.log('✅ UTM click tracked:', payload);
            } else {
                console.warn('⚠️ UTM tracking failed:', response.status);
            }
        }
    } catch (error) {
        if (UTM_TRACKING_CONFIG.debug) {
            console.error('❌ UTM tracking error:', error);
        }
    }
}

/**
 * Initialize UTM click tracking
 */
function initUTMTracking() {
    // Track clicks on all links
    document.addEventListener('click', async (event) => {
        const element = event.target.closest('a');
        if (!element || !element.href) return;

        const url = element.href;
        const isExternal = !url.includes(window.location.hostname);
        const isInternal = !isExternal;

        // Check if we should track this link
        const shouldTrack =
            (hasUTMParams(url)) ||
            (UTM_TRACKING_CONFIG.trackAllLinks && isExternal) ||
            (UTM_TRACKING_CONFIG.trackInternalLinks && isInternal && hasUTMParams(url));

        if (shouldTrack) {
            // Track the click (don't wait for response)
            trackUTMClick(url, element).catch(console.error);

            if (UTM_TRACKING_CONFIG.debug) {
                console.log('🔗 Tracking click:', url, element.textContent?.trim());
            }
        }
    });

    if (UTM_TRACKING_CONFIG.debug) {
        console.log('🚀 UTM Click Tracking initialized');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUTMTracking);
} else {
    initUTMTracking();
}

// Export for manual tracking
window.trackUTMClick = trackUTMClick;

// Usage examples:
// trackUTMClick('https://example.com?utm_source=mybonzo&utm_medium=guide&utm_campaign=test');
// trackUTMClick(element.href, element);