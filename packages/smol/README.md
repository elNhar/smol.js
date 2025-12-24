# smol.js

> Minimal Web Component library with zero dependencies

## Features

- ✅ **Zero dependencies** - Only ~3KB gzipped
- ✅ **Standards-based** - Uses native Web Components
- ✅ **TypeScript-first** - Full type safety
- ✅ **Reactivity** - Fine-grained signals and state
- ✅ **SSR ready** - Server-side rendering support
- ✅ **Framework-agnostic** - Works with anything

## Installation

```bash
npm install smol.js
```

## Quick Start

### Basic Component

```typescript
import { smolComponent, html, smolSignal } from 'smol.js';

smolComponent({
  tag: 'my-counter',
  
  // Scoped CSS
  styles: css`
    button { padding: 0.5rem; }
  `,
  
  // Component Logic
  connected() {
    this.count = smolSignal(0);
  },
  
  // Template with automated reactivity
  template(ctx) {
    const count = this.count.value;
    
    return html`
      <button @click=${() => this.count.value++}>
        Count: ${count}
      </button>
    `;
  }
});
```

## Core Concepts

### Components (`smolComponent`)

Creates a standard native Web Component.

```typescript
smolComponent({
  tag: 'user-card',
  
  // Define attributes to watch for changes
  observedAttributes: ['username'],
  
  // Lifecycle methods
  connected() { console.log('Mounted'); },
  disconnected() { console.log('Unmounted'); },
  
  // React to attribute changes
  attributeChanged(name, oldVal, newVal) {
    // ...
  },
  
  // Render template
  template(ctx) {
    return html`<div>Hello ${ctx.element.getAttribute('username')}</div>`;
  }
});
```

### Reactivity (`smolSignal`, `computed`, `effect`)

Fine-grained reactivity system.

```typescript
// Create a signal
const count = smolSignal(0);

// Create a computed value (updates automatically)
const double = computed(() => count.value * 2);

// Run a side effect when signals change
effect(() => {
  console.log(`Count is ${count.value}, double is ${double.value}`);
});

count.value++; // Logs: "Count is 1, double is 2"
```

### Services (`smolService`)

Singleton services for global state and logic.

```typescript
// Define service
export const authService = smolService({
  name: 'auth',
  factory: () => {
    const user = smolSignal(null);
    return {
      user,
      login: (name) => user.value = name
    };
  }
});

// Use in component
import { authService } from './auth.service';

smolComponent({
  // ...
  template(ctx) {
    const user = authService.user.value;
    return html`
      <div>User: ${user}</div>
      <button @click=${() => authService.login('Alice')}>Login</button>
    `;
  }
});
```

## Templates

### External Templates (`.html?smol`)

You can separate your HTML and CSS into files using the Vite plugin.

**vite.config.ts**:
```typescript
import { smolTemplatePlugin } from 'smol.js/vite';
export default {
  plugins: [smolTemplatePlugin()]
};
```

**my-cmp.ts**:
```typescript
import template from './my-cmp.html?smol';
import styles from './my-cmp.css?inline';

smolComponent({
  tag: 'my-cmp',
  styles,
  template(ctx) {
    // Variables used in HTML must be available in context or locals
    return template(html, this); 
  }
});
```

**my-cmp.html**:
```html
<div>
  <!-- 'count' refers to this.count from the component instance -->
  Count: ${count.value}
</div>
```

## Hydration

For Client-Side Hydration of SSR content:

**main.ts**:
```typescript
// Initializes hydration for all components
import 'smol.js/src/hydrate-client'; 
```

Or manually:
```typescript
import { hydrateAll } from 'smol.js';

document.addEventListener('DOMContentLoaded', () => {
  hydrateAll();
});
```

## API Reference

### `html`
Tagged template literal for defining HTML structure.

### `css`
Tagged template literal for defining styles.

### `smolState(obj)`
Creates a deeply reactive object proxy.

### `inject(service)`
Retrieves a service instance (mostly used internally or for testing).

## License

MIT
