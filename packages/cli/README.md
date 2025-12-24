# @smol/cli

> Command line tools for smol.js - The minimal Web Component framework

## Installation

```bash
npm install -g @smol/cli
```

Or run via npx:

```bash
npx @smol/cli <command>
```

## Commands

### `smol new <type> <name>`

Scaffolds new projects, libraries, components, or services.

#### Types

- **project**
  Creates a new full-stack SSR application.
  ```bash
  smol new project my-app
  ```
  *Features: Vite, SSR, Express server, Auto-hydration*

- **library**
  Creates a reusable component library.
  ```bash
  smol new library my-lib
  ```
  *Features: TypeScript, Storybook, Example component, Vite lib mode*

- **component**
  creates a new Web Component bundle in `src/components/`.
  ```bash
  smol new component my-button
  ```
  *Creates: `my-button.ts`, `my-button.html`, `my-button.css`*

- **service**
  Creates a new global state service in `src/services/`.
  ```bash
  smol new service auth
  ```
  *Creates: `auth-service.ts`*

---

### `smol dev`

Starts the development server with Hot Module Replacement (HMR).

```bash
smol dev
# Options:
# -p, --port <port>   Port number (default: 3000)
```

---

### `smol build`

Builds the project for production.

```bash
smol build
# Options:
# --ssr    Build with Server-Side Rendering support (generates dist/client and dist/server)
```

---

### `smol ssr`

Starts the production SSR server. Expects a built project (run `smol build --ssr` first).

```bash
smol ssr
# Options:
# -p, --port <port>   Port number (default: 4000)
```

## Templates

The CLI includes templates for:

1.  **Smol Project (App)**
    *   Vite config with SSR plugin
    *   Express server for SSR preview
    *   Client-side hydration
    *   HTML template plugin setup

2.  **Smol Library**
    *   Vite library mode configuration
    *   Storybook 8 with Web Components support
    *   Type declaration generation (`d.ts`)

## License

MIT
