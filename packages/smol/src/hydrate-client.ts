import { hydrateAll } from './hydrate';

/**
 * Client-only auto-hydration setup
 * This file should only be imported in client-side code, not SSR
 */

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            hydrateAll();
        });
    } else {
        // DOM already loaded
        hydrateAll();
    }
}
