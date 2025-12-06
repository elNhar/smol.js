import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { smolTemplatePlugin } from './src/vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Smol',
            formats: ['es', 'umd'],
            fileName: (format: string) => format === 'es' ? 'smol.js' : 'smol.umd.js'
        },
        rollupOptions: {
            external: [],
            output: {
                exports: 'named'
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                passes: 2
            },
            mangle: {
                properties: {
                    regex: /^_/
                }
            }
        }
    },
    plugins: [
        smolTemplatePlugin(),
        dts({
            rollupTypes: true,
            insertTypesEntry: true
        })
    ]
});
