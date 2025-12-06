# @smol/ssr

Server-Side Rendering (SSR) for smol.js components. This package provides the necessary utilities to render smol.js components on the server and hydrate them on the client.

## Features

- Server-side rendering of smol.js components
- Seamless hydration on the client
- Vite plugin for development and production builds
- Support for CSS modules and styles
- Integration with Express.js

## Installation

```bash
npm install @smol/ssr
```

## Usage

### Vite Configuration

Add the Vite plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { smolVite } from '@smol/ssr/vite';

export default defineConfig({
  plugins: [
    smolVite({
      ssr: true,
      minify: false,
    })
  ]
});
```

### Server-Side Rendering

Create an Express server to handle SSR:

```typescript
import express from 'express';
import { renderToString } from '@smol/ssr';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files
app.use('/assets', express.static(join(__dirname, 'dist/client/assets')));

// Handle all routes
app.get('*', async (req, res) => {
  try {
    const template = await fs.readFile(join(__dirname, 'dist/client/index.html'), 'utf-8');
    
    const { html, head } = await renderToString({
      url: req.url,
      template,
      entry: './dist/server/entry-server.js'
    });

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
```

### Creating Components

Create your components as usual with smol.js. The SSR package will automatically handle server-side rendering:

**my-component.html**:
```html
<div class="container">
  <h1>${title}</h1>
  <slot></slot>
</div>
```

**my-component.ts**:
```typescript
import { smolComponent, html } from 'smol.js';
import styles from './my-component.css?inline';
import template from './my-component.html?smol';

smolComponent({
  tag: 'my-component',
  
  observedAttributes: ['title'],
  
  styles,
  
  template(ctx) {
    const title = ctx.element.getAttribute('title') || 'Default Title';
    return template(html);
  }
});
```

## API Reference

### `renderToString(options: SSRContext): Promise<SSRResult>`

Renders a smol.js component to a string on the server.

#### Parameters

- `options`: Object containing:
  - `url`: The requested URL
  - `template`: The HTML template string
  - `entry`: Path to the server entry file

#### Returns

A promise that resolves to an object containing:
- `html`: The rendered HTML string
- `head`: Any head content to be injected
- `state`: Application state (if any)

### `smolVite(options: SSRRenderOptions): Plugin`

Vite plugin for SSR support.

#### Options

- `ssr`: Enable/disable SSR (default: `true`)
- `minify`: Enable/disable minification (default: `false`)

## License

MIT
