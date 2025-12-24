WIP do not use for any production work

# smol.js

> Minimal Web Component Framework with SSR - Zero Dependencies

A complete framework for building Web Components with first-class server-side rendering support.

## 📦 Packages

- **`smol.js`** - Core library (2.67 KB gzipped)
- **`@smol/cli`** - CLI and framework tools

## ✨ Features

- ✅ **Tiny** - Core library under 3 KB gzipped
- ✅ **Zero Dependencies** - No runtime dependencies
- ✅ **Standards-Based** - Native Web Components
- ✅ **TypeScript-First** - Full type safety
- ✅ **SSR Ready** - Declarative Shadow DOM support
- ✅ **Framework-Agnostic** - Works everywhere
- ✅ **Tree-Shakable** - Import only what you need

## 🚀 Quick Start

### Installation

```bash
npm install smol.js @smol/cli
```

### Create a New Project

```bash
npx @smol/cli new project my-app
cd my-app
npm install
npm run dev
```

### Create a Component

**my-counter.html**:
```html
<button @click=${() => this.count.value++}>
  Count: ${this.count.value}
</button>
```

**my-counter.css**:
```css
button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
}
```

**my-counter.ts**:
```typescript
import { smolComponent, html, smolSignal } from 'smol.js';
import styles from './my-counter.css?inline';
import template from './my-counter.html?smol';

smolComponent({
  tag: 'my-counter',
  
  styles,
  
  connected() {
    (this as any).count = smolSignal(0);
    (this as any).count.subscribe(() => this.render());
  },
  
  template(ctx) {
    return template(html);
  }
});
```

## 📖 API

### Core Library

#### `smolComponent(config)`
Create a custom Web Component.

#### `smolSignal(value)`
Create a reactive signal.

#### `smolState(object)`
Create a reactive state object.

#### `smolService(config)`
Create a singleton service.

#### `html` `` `
Tagged template for HTML with event listeners.

#### `css` `` `
Tagged template for CSS.

### CLI Commands

```bash
# Create new component/service/project
smol new component my-button
smol new service api
smol new project my-app

# Development
smol dev              # Start dev server
smol dev -p 8080      # Custom port

# Production
smol build            # Build client only
smol build --ssr      # Build with SSR
smol ssr              # Start SSR server
smol ssr -p 4000      # Custom port
```

## 🏗️ SSR Support

smol.js includes built-in SSR with Declarative Shadow DOM:

```typescript
import { renderComponentToString } from 'smol.js';

const html = renderComponentToString(MyCounter, {
  initialCount: '5'
});

// Output:
// <my-counter initialCount="5">
//   <template shadowrootmode="open">
//     <style>...</style>
//     <button>Count: 5</button>
//   </template>
// </my-counter>
```

## 📊 Bundle Size

- **Core Library**: 2.67 KB gzipped
- **With Signals**: 2.67 KB gzipped (included)
- **UMD Build**: 2.05 KB gzipped

## 🎯 Browser Support

- Chrome 90+
- Firefox 123+
- Safari 16.4+
- Edge 90+

(Declarative Shadow DOM support required for SSR)

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT © 2024

---

**Built with ❤️ using Web Standards**
