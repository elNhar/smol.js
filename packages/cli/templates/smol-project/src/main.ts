
import { matchRoute } from './router';

// Hydrate / Initialize Client
async function init() {
    console.log('smol.js SSR app ready!');

    // Intercept links
    document.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A') {
            const href = (target as HTMLAnchorElement).getAttribute('href');
            if (href && href.startsWith('/')) {
                e.preventDefault();
                history.pushState(null, '', href);
                await navigate(href);
            }
        }
    });

    // Handle back/forward
    window.addEventListener('popstate', () => {
        navigate(window.location.pathname);
    });

    // Initial hydration
    // Don't replace content if it's already rendered (Simple check)
    const app = document.getElementById('app');
    const hasContent = app?.innerHTML.trim().length ?? 0 > 0;
    await navigate(window.location.pathname, !hasContent);
}

async function navigate(url: string, replace = true) {
    const route = matchRoute(url);
    if (route) {
        await route.load();
        const app = document.getElementById('app');
        if (app && replace) {
            app.innerHTML = `<${route.component}></${route.component}>`;
        }
    }
}

init();
