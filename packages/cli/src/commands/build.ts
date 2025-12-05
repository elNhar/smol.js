import { build as viteBuild } from 'vite';
import chalk from 'chalk';
import ora from 'ora';

export async function buildCommand(options: { ssr?: boolean }) {
    const spinner = ora('Building for production...').start();

    try {
        // Client build
        await viteBuild({
            build: {
                outDir: 'dist/client',
                emptyOutDir: true
            }
        });

        // SSR build if requested
        if (options.ssr) {
            await viteBuild({
                build: {
                    ssr: true,
                    outDir: 'dist/server',
                    rollupOptions: {
                        input: {
                            'entry-server': './src/entry-server.ts'
                        }
                    }
                }
            });
        }

        spinner.succeed(chalk.green('Build complete!'));
        console.log(chalk.dim(`\n  Output: dist/\n`));
    } catch (error) {
        spinner.fail(chalk.red('Build failed'));
        console.error(error);
        process.exit(1);
    }
}
