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
    return '';
}

function initAds() {
    const adContainers = document.querySelectorAll('[data-ad-slot-id]');
    const pubId = (adsConfig && adsConfig.adsense && adsConfig.adsense.publisherId) ? adsConfig.adsense.publisherId : 'ca-pub-7567710578353984';
    
    adContainers.forEach(container => {
        const slotKey = container.getAttribute('data-ad-slot-id');
        
        if (adsConfig && adsConfig.adSlots && adsConfig.adSlots[slotKey]) {
            const slot = adsConfig.adSlots[slotKey];
            if (slot.slotId && slot.slotId !== 'XXXXXXXXXX') {
                container.innerHTML = '';
                const ins = document.createElement('ins');
                ins.className = 'adsbygoogle';
                ins.style.display = 'block';
                ins.setAttribute('data-ad-client', pubId);
                ins.setAttribute('data-ad-slot', slot.slotId);
                ins.setAttribute('data-ad-format', slot.responsive ? 'auto' : slot.format);
                if (slot.responsive) {
                    ins.setAttribute('data-full-width-responsive', 'true');
                }
                container.appendChild(ins);
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error('AdSense error:', e);
                }
            }
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadAdsConfig();
    initAds();
});
