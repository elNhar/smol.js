import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            'smol.js': resolve(__dirname, '../../packages/smol/src/index.ts')
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
