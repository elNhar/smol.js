
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { JSDOM } from 'jsdom';

// SSR Polyfills using JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true
});
const win = dom.window;

// Expose necessary globals for SSR
global.document = win.document;
global.HTMLElement = win.HTMLElement;
global.customElements = win.customElements;
global.Node = win.Node;
global.Text = win.Text;
global.Comment = win.Comment;

async function createServer() {
    const app = express();

    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        try {
            // 1. Read index.html
            let template = fs.readFileSync(
                path.resolve(__dirname, 'index.html'),
                'utf-8'
            );

            // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
            //    and also applies HTML transforms from Vite plugins, e.g. global preambles
            template = await vite.transformIndexHtml(url, template);

            // 3. Load the server entry. ssrLoadModule automatically transforms
            //    ESM source code to be usable in Node.js! There is no bundling
            //    required, and provides efficient invalidation similar to HMR.
            const { render } = await vite.ssrLoadModule('/src/entry-server.ts');

            // 4. render the app HTML. This assumes entry-server.ts exports a `render`
            //    function that takes the URL and returns an object with `html`, `head`, etc.
            const { html: appHtml, head } = await render(url);

            // 5. Inject the app-rendered HTML into the template.
            const html = template
                .replace(`<!--ssr-outlet-->`, appHtml)
                .replace(`<!--head-outlet-->`, head || '');

            // 6. Send the rendered HTML back.
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            // If an error is caught, let Vite fix the stack trace so it maps back
            // to your actual source code.
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(3000, () => {
        console.log('Server running at http://localhost:3000');
    });
}

createServer();
