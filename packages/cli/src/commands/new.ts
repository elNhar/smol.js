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

import { copyTemplate } from '../utils/template.js';

async function createProject(name: string) {
  const projectDir = path.join(process.cwd(), name);

  await copyTemplate('smol-project', projectDir, { name });

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
