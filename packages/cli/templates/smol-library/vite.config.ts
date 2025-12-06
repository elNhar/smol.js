import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MySmolComponents',
      fileName: (format) => `my-smol-components.${format}.js`,
    },
    rollupOptions: {
      external: ['smol.js'],
      output: {
        globals: {
          'smol.js': 'smol',
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
