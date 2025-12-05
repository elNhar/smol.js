// smol.js - Minimal Web Component Library
// Zero dependencies, tree-shakable, standards-based

// Core component creation
export { smolComponent } from './component';

// Services and dependency injection
export { smolService, inject, clearServices } from './service';

// Reactivity primitives
export { smolSignal, computed, effect } from './signal';
export { smolState } from './state';

// Template helpers
export { html, render, renderToString, isTemplateResult } from './html';
export { css } from './css';

// SSR utilities
export { renderComponentToString, ssr } from './ssr';

// Hydration utilities
export { hydrateComponent, hydrateAll } from './hydrate';

// TypeScript types
export type {
    SmolComponentConfig,
    SmolContext,
    SmolElement,
    TemplateResult,
    Signal,
    State,
    SmolServiceConfig
} from './types';
