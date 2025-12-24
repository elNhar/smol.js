import { defineConfig } from 'vite';
import { smolVite } from 'smol-ssr/vite';
import { smolTemplatePlugin } from 'smol.js/vite';

export default defineConfig((env) => ({
    plugins: [
        smolTemplatePlugin(),
        smolVite({
            ssr: !!env.isSsrBuild,
            minify: 'esbuild',
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        target: 'esnext',
        minify: 'esbuild'
    },
    ssr: {
        noExternal: ['smol.js', 'smol-ssr']
    }
}));
