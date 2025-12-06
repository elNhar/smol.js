import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function createLibrary(name: string) {
  const projectDir = path.join(process.cwd(), name);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Create directory structure
  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/components'), { recursive: true });
  await fs.mkdir(path.join(projectDir, '.storybook'), { recursive: true });

  // Create package.json
  const packageJson = {
    name,
    version: '0.1.0',
    type: 'module',
    private: true,
    main: './dist/index.js',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        import: './dist/index.js',
        types: './dist/index.d.ts'
      },
      './*': './dist/*.js'
    },
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      storybook: 'storybook dev -p 6006',
      'build-storybook': 'storybook build'
    },
    dependencies: {
      'smol.js': 'file:../smol.js/packages/smol'
    },
    devDependencies: {
      '@storybook/web-components': '^8.0.0',
      '@storybook/web-components-vite': '^8.0.0',
      '@storybook/addon-essentials': '^8.0.0',
      'storybook': '^8.0.0',
      'typescript': '^5.0.0',
      'vite': '^5.0.0',
      'vite-plugin-dts': '^3.6.0',
      'glob': '^10.3.10'
    }
  };

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create Vite config
  const viteConfig = `import { defineConfig } from 'vite';
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
          components.map(file => [
            file.replace(/^src\\/components\\//, '').replace(/\\.ts$/, ''),
            resolve(__dirname, file)
          ])
        )
      },
      formats: ['es'],
      fileName: (format, entryName) => \`\${entryName}.js\`
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
`;
  await fs.writeFile(path.join(projectDir, 'vite.config.ts'), viteConfig);

  // Rest of template files... (tsconfig, storybook, components, etc.)
  // Continuing with the rest...
  const tsConfig = `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "useDefineForClassFields": true,\n    "module": "ESNext",\n    "lib": ["ES2020", "DOM", "DOM.Iterable"],\n    "skipLibCheck": true,\n    "moduleResolution": "bundler",\n    "allowImportingTsExtensions": true,\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "declaration": true,\n    "declarationMap": true,\n    "outDir": "./dist",\n    "strict": true,\n    "noUnusedLocals": true,\n    "noUnusedParameters": true,\n    "noFallthroughCasesInSwitch": true\n  },\n  "include": ["src"]\n}\n`;
  await fs.writeFile(path.join(projectDir, 'tsconfig.json'), tsConfig);

  const storybookMain = `import type { StorybookConfig } from '@storybook/web-components-vite';\n\nconst config: StorybookConfig = {\n  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],\n  addons: ['@storybook/addon-essentials'],\n  framework: {\n    name: '@storybook/web-components-vite',\n    options: {}\n  },\n  docs: { autodocs: 'tag' }\n};\n\nexport default config;\n`;
  await fs.writeFile(path.join(projectDir, '.storybook/main.ts'), storybookMain);

  const storybookPreview = `export const parameters = {\n  actions: { argTypesRegex: '^on[A-Z].*' },\n  controls: {\n    matchers: {\n      color: /(background|color)$/i,\n      date: /Date$/\n    }\n  }\n};\n`;
  await fs.writeFile(path.join(projectDir, '.storybook/preview.ts'), storybookPreview);

  const indexTs = `export * from './components/example-button/example-button';\n`;
  await fs.writeFile(path.join(projectDir, 'src/index.ts'), indexTs);

  await fs.mkdir(path.join(projectDir, 'src/components/example-button'), { recursive: true });

  const exampleHtml = `<button @click=\${() => ctx.emit('click')}>\n  <slot>Click me</slot>\n</button>`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-button/example-button.html'), exampleHtml);

  const exampleCss = `:host {\n  display: inline-block;\n}\n\nbutton {\n  padding: 0.5rem 1rem;\n  background: var(--button-bg, #3b82f6);\n  color: white;\n  border: none;\n  border-radius: 0.25rem;\n  cursor: pointer;\n  font-family: system-ui, sans-serif;\n  font-size: 1rem;\n  transition: background 0.2s;\n}\n\nbutton:hover {\n  background: var(--button-hover-bg, #2563eb);\n}\n\nbutton:active {\n  transform: scale(0.98);\n}`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-button/example-button.css'), exampleCss);

  const exampleTs = `import { smolComponent, html } from 'smol.js';\nimport styles from './example-button.css?inline';\nimport template from './example-button.html?smol';\n\nsmolComponent({\n  tag: 'example-button',\n  styles,\n  template(ctx) {\n    return template(html);\n  }\n});\n`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-button/example-button.ts'), exampleTs);

  const exampleStory = `import type { Meta, StoryObj } from '@storybook/web-components';\nimport { html } from 'lit-html';\nimport './example-button';\n\nconst meta: Meta = {\n  title: 'Components/ExampleButton',\n  component: 'example-button',\n  tags: ['autodocs'],\n  argTypes: { onClick: { action: 'click' } }\n};\n\nexport default meta;\ntype Story = StoryObj;\n\nexport const Default: Story = {\n  render: () => html\`<example-button>Click me</example-button>\`\n};\n\nexport const CustomText: Story = {\n  render: () => html\`<example-button>Custom Button</example-button>\`\n};\n`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-button/example-button.stories.ts'), exampleStory);

  const readme = `# ${name}\n\nWeb component library built with smol.js.\n\n## Installation\n\n\`\`\`bash\nnpm install ${name}\n\`\`\`\n\n## Development\n\n\`\`\`bash\nnpm install\nnpm run storybook  # View components\nnpm run build      # Build library\n\`\`\`\n`;
  await fs.writeFile(path.join(projectDir, 'README.md'), readme);

  const gitignore = `node_modules\ndist\n.storybook-static\n*.log\n.DS_Store\n`;
  await fs.writeFile(path.join(projectDir, '.gitignore'), gitignore);

  console.log(chalk.green(`\n  Successfully created library: ${name}`));
  console.log(chalk.dim('\n  Next steps:'));
  console.log(chalk.dim(`  cd ${name}`));
  console.log(chalk.dim('  npm install'));
  console.log(chalk.dim('  npm run storybook'));
}
