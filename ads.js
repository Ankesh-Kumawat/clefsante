/**
 * Clefsanté - Ad Management System
 * Loads ads from data/ads.json configuration
 */

let adsConfig = null;

async function loadAdsConfig() {
    try {
        const response = await fetch('data/ads.json');
        adsConfig = await response.json();
        return adsConfig;
    } catch (error) {
        console.error('Failed to load ads config:', error);
        return null;
    }
}

function createAdUnit(slotId, format, responsive = true) {
    if (!slotId || slotId === 'XXXXXXXXXX') {
        return `<div class="ad-placeholder-preview">Ad Slot - Update ads.json with real slot ID</div>`;
    }

    return `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-7567710578353984"
             data-ad-slot="${slotId}"
             data-ad-format="${responsive ? 'auto' : format}"
             ${responsive ? 'data-full-width-responsive="true"' : ''}></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    `;
}

function initAds() {
    const adContainers = document.querySelectorAll('[data-ad-slot-id]');
    
    adContainers.forEach(container => {
        const slotKey = container.getAttribute('data-ad-slot-id');
        
        if (adsConfig && adsConfig.adSlots && adsConfig.adSlots[slotKey]) {
            const slot = adsConfig.adSlots[slotKey];
            container.innerHTML = createAdUnit(slot.slotId, slot.format, slot.responsive);
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadAdsConfig();
    initAds();
});
