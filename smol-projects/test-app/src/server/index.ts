import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderToString } from 'smol-ssr';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from dist
app.use('/assets', express.static(join(__dirname, '../dist/client/assets')));

// Serve the application
app.get('*', async (req, res) => {
    try {
        // Read the HTML template
        const template = readFileSync(join(__dirname, '../dist/client/index.html'), 'utf-8');

        // Render the app to a string
        const { html, head } = await renderToString({
            url: req.url,
            template,
            entry: './dist/server/entry-server.js'
        });

        // Inject the rendered content into the template
        const finalHtml = template
            .replace('<!--ssr-outlet-->', html)
            .replace('<!--head-outlet-->', head || '');

        res.setHeader('Content-Type', 'text/html');
        res.end(finalHtml);
    } catch (error) {
        console.error('SSR Error:', error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
