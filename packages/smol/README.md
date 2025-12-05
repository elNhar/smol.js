# smol.js

> Minimal Web Component library with zero dependencies

## Installation

```bash
npm install smol.js
```

## Quick Start

```typescript
import { smolComponent, html, css } from 'smol.js';

const MyButton = smolComponent({
  tag: 'my-button',
  observedAttributes: ['variant'],
  
  styles: css`
    button {
      padding: 0.5rem 1rem;
      background: var(--button-bg, #3b82f6);
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
    }
  `,
  
  template(ctx) {
    return html`
      <button @click=${() => ctx.emit('click')}>
        <slot>Button</slot>
      </button>
    `;
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
