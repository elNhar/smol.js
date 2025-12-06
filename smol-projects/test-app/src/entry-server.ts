
import { matchRoute } from './router';
import { renderComponentToString } from 'smol.js';

export async function render(url: string) {
    const route = matchRoute(url);
    let content = '<h1>404 Not Found</h1>';

    if (route) {
        const module = await route.load();
        const ComponentClass = module.default;

        if (ComponentClass) {
            content = renderComponentToString(ComponentClass);
        } else {
            // Fallback if no default export or class found
            content = `<${route.component}></${route.component}>`;
        }
    }

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
