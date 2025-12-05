#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { newCommand } from './commands/new.js';
import { devCommand } from './commands/dev.js';
import { buildCommand } from './commands/build.js';
import { ssrCommand } from './commands/ssr.js';

program
    .name('smol')
    .description('CLI for smol.js - Minimal Web Component framework')
    .version('0.1.0');

// smol new <type> <name>
program
    .command('new <type> <name>')
    .description('Create a new component, service, or project')
    .action(newCommand);

// smol dev
program
    .command('dev')
    .description('Start development server with HMR')
    .option('-p, --port <port>', 'Port number', '3000')
    .action(devCommand);

// smol build
program
    .command('build')
    .description('Build for production')
    .option('--ssr', 'Build with SSR')
    .action(buildCommand);

// smol ssr
program
    .command('ssr')
    .description('Start SSR production server')
    .option('-p, --port <port>', 'Port number', '4000')
    .action(ssrCommand);

program.parse();
