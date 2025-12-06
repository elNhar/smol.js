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
    await navigate(window.location.pathname);
}

async function navigate(url: string) {
    const route = matchRoute(url);
    if (route) {
        await route.load();
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<${route.component}></${route.component}>`;
        }
    }
}


init();
