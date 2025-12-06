import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { smolTemplatePlugin } from 'smol.js/vite';
import { resolve } from 'path';
import { glob } from 'glob';

const components = glob.sync('src/components/**/!(*.stories).ts');

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...Object.fromEntries(
          components.map((file: any) => [
            file.replace(/^src\/components\//, '').replace(/\.ts$/, ''),
            resolve(__dirname, file)
          ])
        )
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: ['smol.js'],
      output: {
        preserveModules: false,
        exports: 'named'
      }
    }
  },
  plugins: [
    smolTemplatePlugin(),
    dts({ insertTypesEntry: true })
  ]
});
