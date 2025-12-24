import type { PluginOption } from 'vite';
import { SSRRenderOptions } from './types';

export function smolVite(options: SSRRenderOptions = {}): PluginOption {
  const { ssr = true, minify = false } = options;

  return {
    name: 'vite-plugin-smol-ssr',
    enforce: 'pre',
    config() {
      return {
        build: {
          ssr: true,
          minify,
          rollupOptions: {
            input: {
              'entry-server': 'src/entry-server.ts'
            },
            output: {
              format: 'esm',
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: 'assets/[name][extname]'
            }
          }
        },
        ssr: {
          noExternal: ['smol.js']
        }
      };
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!ssr) return html;

        // Add SSR placeholders
        return html
          .replace('<!--ssr-outlet-->', '')
          .replace('<!--head-outlet-->', '');
      }
    },
    generateBundle(_, bundle) {
      // Clean up any client-side specific code in SSR build
      if (ssr) {
        for (const [id, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && chunk.code) {
            // Remove any browser-specific code that shouldn't be in SSR
            chunk.code = chunk.code
              .replace(/document\.(add|remove)EventListener\s*\(/g, '/* $& */')
              .replace(/window\./g, 'globalThis.');
          }
        }
      }
    }
  };
}
