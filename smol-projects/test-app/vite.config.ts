import { defineConfig } from 'vite';
import { smolVite } from '@smol/ssr/vite';
import { smolTemplatePlugin } from 'smol.js/vite';

export default defineConfig({
    plugins: [
        smolTemplatePlugin(),
        smolVite({
            ssr: true,
            minify: 'esbuild',
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        target: 'esnext',
        minify: 'esbuild',
        ssr: {
            noExternal: ['smol.js', '@smol/ssr']
        },
        rollupOptions: {
            input: 'src/entry-server.ts',
            output: {
                format: 'esm',
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name][extname]'
            }
        }
    },
    ssr: {
        noExternal: ['smol.js', '@smol/ssr']
    }
});
