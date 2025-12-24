# smol-ssr

> Server-Side Rendering (SSR) for smol.js components.

This package provides the necessary utilities to render smol.js components on the server and hydrate them on the client.

## Features

- ✅ **Server-side rendering** of smol.js components
- ✅ **Seamless hydration** on the client
- ✅ **Vite plugin** for development and production builds
- ✅ **CSS Modules** support via Vite

## Installation

```bash
npm install smol-ssr
```

## Usage

### Vite Configuration

Add the Vite plugin to your `vite.config.ts`. It is recommended to use specific build flags:

```typescript
import { defineConfig } from 'vite';
import { smolVite } from 'smol-ssr/vite';

export default defineConfig((env) => ({
  plugins: [
    smolVite({
      // Enable SSR optimizations only for SSR builds
      ssr: !!env.isSsrBuild,
      // Use 'esbuild' or 'terser' for minification
      minify: 'esbuild',
    })
  ],
  // ...
}));
```

### Server-Side Rendering (Production)

Your production server (e.g., Express) should load the server entry and render the requested URL.

```typescript
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Load the compiled server entry
// Note: In production this will be built to dist/ssr/assets/entry-server.js
const { render } = await import('./dist/ssr/assets/entry-server.js');

const app = express();

app.use(express.static('dist/client'));

app.get('*', async (req, res) => {
  try {
    const url = req.originalUrl;
    
    // Render the app
    const { html: appHtml, head } = await render(url);

    // Read index.html template
    // Inject rendered content into placeholders
    // ... (see full example in CLI templates)
    
    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
  } catch (e) {
    // ...
  }
});
```

### Creating Components

Create your components as usual with `smol.js`. The SSR package automatically handles rendering their template results to string.

```typescript
smolComponent({
  tag: 'my-meta',
  template(ctx) {
    return html`
      <meta name="description" content="Server rendered meta tag">
    `;
  }
});
```

## API Reference

### `smolVite(options: SSRRenderOptions): Plugin`

Vite plugin that configures the build for SSR.

#### Options

- `ssr` (boolean): Enable SSR optimizations. Default: `true` (if not specified, force enables SSR build config).
- `minify` (boolean | 'terser' | 'esbuild'): Minification strategy for server bundle.
    - `false`: Disable minification (default)
    - `'terser'`: Use Terser (best compression)
    - `'esbuild'`: Use esbuild (fastest)

### `renderToString(options: SSRContext): Promise<SSRResult>`

Referece implementation for rendering an app.

#### Returns
- `html`: Rendered body HTML
- `head`: Rendered head elements (meta, title, styles)
- `state`: Serialized state for hydration

## License

MIT
