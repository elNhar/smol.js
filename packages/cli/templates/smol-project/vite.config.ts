import { defineConfig } from 'vite';
import { smolVite } from '@smol/ssr/vite';
import { smolTemplatePlugin } from 'smol.js/vite';

export default defineConfig({
    plugins: [
        smolTemplatePlugin(),
        smolVite({
            ssr: true,
            minify: false,
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        target: 'esnext',
        minify: 'esbuild'
    }
});
