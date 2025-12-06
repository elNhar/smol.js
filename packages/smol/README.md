# smol.js

> Minimal Web Component library with zero dependencies

## Installation

```bash
npm install smol.js
```

## Quick Start

**my-button.html**:
```html
<button @click=${() => ctx.emit('click')}>
  <slot>Button</slot>
</button>
```

**my-button.css**:
```css
button {
  padding: 0.5rem 1rem;
  background: var(--button-bg, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
```

**my-button.ts**:
```typescript
import { smolComponent, html } from 'smol.js';
import styles from './my-button.css?inline';
import template from './my-button.html?smol';

smolComponent({
  tag: 'my-button',
  observedAttributes: ['variant'],
  
  styles,
  
  template(ctx) {
    return template(html);
  }
});
```

## Features

- ✅ **Zero dependencies** - Only ~3KB gzipped
- ✅ **Standards-based** - Uses native Web Components
- ✅ **TypeScript-first** - Full type safety
- ✅ **SSR ready** - Server-side rendering support
- ✅ **Framework-agnostic** - Works with React, Vue, Angular, etc.
- ✅ **Tree-shakable** - Import only what you need
- ✅ **External templates** - Write HTML in separate files

## Using External HTML Templates

You can keep your component templates in separate `.html` files for better organization and IDE support.

### Setup

Add the Vite plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { smolTemplatePlugin } from 'smol.js/vite';

export default defineConfig({
  plugins: [
    smolTemplatePlugin()
  ]
});
```

### Create a Template File

**my-component.html**:
```html
<div class="container">
  <h1>${title}</h1>
  <button @click=${() => count.value++}>
    Count: ${count.value}
  </button>
</div>
```

**my-component.css**:
```css
.container {
  padding: 1rem;
}
```

### Import and Use

**my-component.ts**:
```typescript
import { smolComponent, html, smolSignal } from 'smol.js';
import styles from './my-component.css?inline';
import template from './my-component.html?smol';

smolComponent({
  tag: 'my-component',
  
  styles,
  
  connected() {
    this.count = smolSignal(0);
    this.count.subscribe(() => this.render());
  },
  
  template(ctx) {
    const title = 'Hello World';
    const count = this.count;
    return template(html);
  }
});
```

**Note**: The `?smol` query parameter is required for the plugin to process the HTML file.


## API

### `smolComponent(config)`

Creates a custom Web Component.

### `smolSignal(value)`

Creates a reactive signal.

### `smolState(object)`

Creates a reactive state object.

### `smolService(config)`

Creates a singleton service.

### `html``

Tagged template for HTML.

### `css``

Tagged template for CSS.

## License

MIT
