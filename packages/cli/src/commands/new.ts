import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createLibrary } from './createLibrary.js';

export async function newCommand(type: string, name: string) {
  const spinner = ora(`Creating ${type}: ${name}`).start();

  try {
    switch (type) {
      case 'component':
        await createComponent(name);
        break;
      case 'service':
        await createService(name);
        break;
      case 'library':
        await createLibrary(name);
        break;
      case 'project':
        await createProject(name);
        break;
      default:
        spinner.fail(chalk.red(`Unknown type: ${type}`));
        console.log(chalk.yellow('\nValid types: component, service, library, project'));
        process.exit(1);
    }

    spinner.succeed(chalk.green(`Created ${type}: ${name}`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to create ${type}`));
    console.error(error);
    process.exit(1);
  }
}

async function createComponent(name: string) {
  const componentName = name.includes('-') ? name : `smol-${name}`;
  const className = toPascalCase(componentName);
  const fileName = `${componentName}.ts`;
  const htmlFileName = `${componentName}.html`;
  const cssFileName = `${componentName}.css`;

  // Create HTML template file
  const htmlTemplate = `<div>
  <h2>${className}</h2>
  <slot></slot>
</div>`;

  // Create CSS file
  const cssTemplate = `:host {
  display: block;
}`;

  // Create TypeScript component file
  const template = `import { smolComponent, html } from 'smol.js';
import styles from './${cssFileName}?inline';
import template from './${htmlFileName}?smol';

smolComponent({
  tag: '${componentName}',
  
  styles,
  
  template(ctx) {
    return template(html);
  }
});
`;

  const dir = path.join(process.cwd(), 'src/components');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), template);
  await fs.writeFile(path.join(dir, htmlFileName), htmlTemplate);
  await fs.writeFile(path.join(dir, cssFileName), cssTemplate);

  console.log(chalk.dim(`\n  Created: src/components/${fileName}`));
  console.log(chalk.dim(`  Created: src/components/${htmlFileName}`));
  console.log(chalk.dim(`  Created: src/components/${cssFileName}`));
}

async function createService(name: string) {
  const serviceName = `${toPascalCase(name)}Service`;
  const fileName = `${name}-service.ts`;

  const template = `import { smolService } from 'smol.js';

export const ${serviceName} = smolService({
  name: '${serviceName}',
  factory: () => ({
    // Service methods here
  })
});
`;

  const dir = path.join(process.cwd(), 'src/services');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), template);

  console.log(chalk.dim(`\n  Created: src/services/${fileName}`));
}

async function createProject(name: string) {
  const projectDir = path.join(process.cwd(), name);

  // Create directory structure
  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/components'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/pages'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/styles'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/utils'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/server'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'public'), { recursive: true });
  await fs.mkdir(path.join(projectDir, '.storybook'), { recursive: true });

  // Create package.json
  const packageJson = {
    name,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      'smol.js': 'file:../smol.js/packages/smol',
      'express': '^4.18.0',
      '@smol/ssr': 'file:../smol.js/packages/ssr'
    },
    devDependencies: {
      'typescript': '^5.0.0',
      'vite': '^5.0.0',
      '@types/express': '^4.17.0',
      '@types/node': '^20.0.0'
    }
  };

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create Vite config
  const viteConfig = `import { defineConfig } from 'vite';
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
`;
  await fs.writeFile(path.join(projectDir, 'vite.config.ts'), viteConfig);

  // Create main server file
  const serverIndex = `import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { renderToString } from '@smol/ssr';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from dist
app.use('/assets', express.static(join(__dirname, '../dist/client/assets')));

// Serve the application
app.get('*', async (req, res) => {
  try {
    // Read the HTML template
    const template = readFileSync(join(__dirname, '../dist/client/index.html'), 'utf-8');
    
    // Render the app to a string
    const { html, head } = await renderToString({
      url: req.url,
      template,
      entry: './dist/server/entry-server.js'
    });

    // Inject the rendered content into the template
    const finalHtml = template
      .replace('<!--ssr-outlet-->', html)
      .replace('<!--head-outlet-->', head || '');

    res.setHeader('Content-Type', 'text/html');
    res.end(finalHtml);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
`;
  await fs.writeFile(path.join(projectDir, 'src/server/index.ts'), serverIndex);

  // Create entry-server.ts
  const entryServer = `import { renderToString } from '@smol/ssr';

export async function render(url: string) {
  const app = document.createElement('div');
  app.id = 'app';
  
  // This would be replaced with your actual app rendering logic
  app.innerHTML = \`
    <h1>Welcome to ${name}</h1>
    <p>Server-side rendering is working!</p>
  \`;
  
  return {
    html: app.outerHTML,
    head: ''
  };
}
`;
  await fs.writeFile(path.join(projectDir, 'src/entry-server.ts'), entryServer);

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <!--head-outlet-->
  </head>
  <body>
    <div id="app">
      <!--ssr-outlet-->
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;
  await fs.writeFile(path.join(projectDir, 'index.html'), indexHtml);

  // Create src/main.ts
  const mainTs = `import './components/example-component';

console.log('smol.js SSR app ready!');
`;
  await fs.writeFile(path.join(projectDir, 'src/main.ts'), mainTs);

  // Create example component HTML template
  const exampleHtml = `<div class="container">
  <h1>\${title}</h1>
  <slot></slot>
</div>`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-component.html'), exampleHtml);

  // Create example component TypeScript
  const exampleComponent = `import { smolComponent, html } from 'smol.js';
import styles from './example-component.css?inline';
import template from './example-component.html?smol';

smolComponent({
  tag: 'example-component',
  
  observedAttributes: ['title'],
  
  styles,
  
  template(ctx) {
    const title = ctx.element.getAttribute('title') || 'Hello World';
    return template(html);
  }
});
`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-component.ts'), exampleComponent);

  // Create component CSS
  const exampleCss = `.container {
  font-family: system-ui, sans-serif;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.5rem;
}
`;
  await fs.writeFile(path.join(projectDir, 'src/components/example-component.css'), exampleCss);

  // Create Storybook config
  const storybookMain = `module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag',
  },
};
`;
  await fs.writeFile(path.join(projectDir, '.storybook/main.js'), storybookMain);

  // Create Storybook preview
  const storybookPreview = `import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
`;
  await fs.writeFile(path.join(projectDir, '.storybook/preview.js'), storybookPreview);

  // Create example story
  const exampleStory = `import { html } from 'lit';
import { ExampleComponent } from '../src/components/example-component';

export default {
  title: 'Components/Example',
  component: 'example-component',
  argTypes: {
    title: { control: 'text' },
  },
};

// Register the component for Storybook
if (!customElements.get('example-component')) {
  customElements.define('example-component', ExampleComponent);
}

const Template = ({ title, slot }) => 
  html\`<example-component title=\${title}>\${slot}</example-component>\`;

export const Default = Template.bind({});
Default.args = {
  title: 'Hello Storybook',
  slot: html\`<p>This is an example component in Storybook</p>\`,
};
`;
  await fs.mkdir(path.join(projectDir, 'src/stories'), { recursive: true });
  await fs.writeFile(path.join(projectDir, 'src/stories/Example.stories.ts'), exampleStory);

  // Create custom-elements.json for Storybook
  const customElementsJson = `{
    "version": 2,
    "tags": [
      {
        "name": "example-component",
        "description": "An example web component",
        "attributes": [
          {
            "name": "title",
            "description": "The component title",
            "type": "string"
          }
        ],
        "properties": [],
        "events": []
      }
    ]
  }
  `;
  await fs.writeFile(path.join(projectDir, 'custom-elements.json'), customElementsJson);

  // Create TypeScript config
  const tsConfig = `{
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "module": "ESNext",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }
  `;
  await fs.writeFile(path.join(projectDir, 'tsconfig.json'), tsConfig);

  // Create TypeScript config for Node
  const tsConfigNode = `{
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts", "src/server/**/*.ts"]
  }
  `;
  await fs.writeFile(path.join(projectDir, 'tsconfig.node.json'), tsConfigNode);

  // Create .gitignore
  const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependency directories
node_modules
.pnp
.pnp.js

# Build output
dist
.storybook-static

# Environment variables
.env
.env.*
!.env.example

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
  await fs.writeFile(path.join(projectDir, '.gitignore'), gitignore);

  console.log(chalk.green(`\n  Successfully created project: ${name}`));
  console.log(chalk.dim('\n  Next steps:'));
  console.log(chalk.dim(`  cd ${name}`));
  console.log(chalk.dim('  npm install'));
  console.log(chalk.dim('\n  Development:'));
  console.log(chalk.dim('  npm run dev           # Start dev server'));
  console.log(chalk.dim('\n  Production:'));
  console.log(chalk.dim('  npm run build         # Build for production'));
  console.log(chalk.dim('  npm run preview       # Preview SSR build'));
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
