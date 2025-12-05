import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

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
      case 'project':
        await createProject(name);
        break;
      default:
        spinner.fail(chalk.red(`Unknown type: ${type}`));
        console.log(chalk.yellow('\nValid types: component, service, project'));
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

  const template = `import { smolComponent, html, css } from 'smol.js';

export const ${className} = smolComponent({
  tag: '${componentName}',
  
  styles: css\`
    :host {
      display: block;
    }
  \`,
  
  template() {
    return html\`
      <div>
        <h2>${className}</h2>
        <slot></slot>
      </div>
    \`;
  }
});
`;

  const dir = path.join(process.cwd(), 'src/components');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), template);

  console.log(chalk.dim(`\n  Created: src/components/${fileName}`));
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
  await fs.mkdir(path.join(projectDir, 'src/components'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'src/services'), { recursive: true });
  await fs.mkdir(path.join(projectDir, 'public'), { recursive: true });

  // Create package.json
  const packageJson = {
    name,
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'smol dev',
      build: 'smol build',
      preview: 'smol ssr'
    },
    dependencies: {
      'smol.js': '^0.1.0'
    },
    devDependencies: {
      '@smol/cli': '^0.1.0',
      'typescript': '^5.0.0'
    }
  };

  await fs.writeFile(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectDir, 'index.html'), indexHtml);

  // Create src/main.ts
  const mainTs = `console.log('smol.js app ready!');
`;

  await fs.writeFile(path.join(projectDir, 'src/main.ts'), mainTs);

  console.log(chalk.dim(`\n  Created project structure in: ${name}/`));
  console.log(chalk.dim(`\n  Next steps:`));
  console.log(chalk.dim(`    cd ${name}`));
  console.log(chalk.dim(`    npm install`));
  console.log(chalk.dim(`    npm run dev`));
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
