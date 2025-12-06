import type { SmolElement } from 'smol.js';

export interface SSRContext {
  url: string;
  template: string;
  entry: string;
}

export interface SSRResult {
  html: string;
  head: string;
  state?: Record<string, any>;
}

export interface SSRRenderOptions {
  ssr?: boolean;
  minify?: boolean;
}

declare global {
  interface Window {
    __SSR_STATE__?: Record<string, any>;
  }
}
