import { matchRoute } from './router';

export async function render(url: string) {
    const route = matchRoute(url);
    if (route) {
        await route.load();
    }

    // Simple 404 handling if no route found (could be better)
    const componentTag = route ? route.component : 'div';
    const content = route ? `<${componentTag}></${componentTag}>` : '<h1>404 Not Found</h1>';

    // This would be replaced with your actual app rendering logic
    const appHtml = `
    <nav>
        <a href="/">Home</a> | <a href="/about">About</a>
    </nav>
    <div id="app">
        ${content}
    </div>
  `;

    return {
        html: appHtml,
        head: ''
    };
}
