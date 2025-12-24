import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SSR Polyfills using JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
});
const win = dom.window;

global.document = win.document;
global.HTMLElement = win.HTMLElement;
global.customElements = win.customElements;
global.Node = win.Node;
global.Text = win.Text;
global.Comment = win.Comment;

const app = express();

// Serve static files from dist
app.use(express.static('dist', { index: false }));

// Import the built server entry
const { render } = await import('./dist/ssr/assets/entry-server.js');

// Read the HTML template
const template = fs.readFileSync(
    path.resolve(__dirname, 'dist/index.html'),
    'utf-8'
);

// Handle all routes
app.get('*', async (req, res) => {
    try {
        const url = req.originalUrl;
        const { html: appHtml, head } = await render(url);

        const html = template
            .replace(`<!--ssr-outlet-->`, appHtml)
            .replace(`<!--head-outlet-->`, head || '');

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
        console.error('Server error:', e);
        res.status(500).end('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Preview server running at http://localhost:${PORT}`);
});
