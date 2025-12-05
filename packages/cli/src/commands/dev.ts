import { createServer as createViteServer } from 'vite';
import chalk from 'chalk';
import ora from 'ora';

export async function devCommand(options: { port?: string }) {
    const spinner = ora('Starting development server...').start();
    const port = parseInt(options.port || '3000');

    try {
        const server = await createViteServer({
            server: {
                port,
                open: true
            }
        });

        await server.listen();

        spinner.succeed(chalk.green('Development server started'));
        console.log(chalk.cyan(`\n  ➜ Local:   http://localhost:${port}/\n`));
    } catch (error) {
        spinner.fail(chalk.red('Failed to start server'));
        console.error(error);
        process.exit(1);
    }
}
