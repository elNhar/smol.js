import express from 'express';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export async function ssrCommand(options: { port?: string }) {
    const spinner = ora('Starting SSR server...').start();
    const port = parseInt(options.port || '4000');

    try {
        const app = express();

        // Serve static assets
        app.use(express.static(path.join(process.cwd(), 'dist/client')));

        // SSR middleware
        app.use('*', async (req, res) => {
            try {
                // Load the server bundle
                const entryServer = await import(
                    path.join(process.cwd(), 'dist/server/entry-server.js')
                );

                // Render to HTML
                const appHtml = await entryServer.render(req.url);

                // Load the client HTML template
                const template = fs.readFileSync(
                    path.join(process.cwd(), 'dist/client/index.html'),
                    'utf-8'
                );

                // Inject the rendered app HTML
                const html = template.replace('<!--ssr-outlet-->', appHtml);

                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } catch (error) {
                console.error(error);
                res.status(500).end('Internal Server Error');
            }
        });

        app.listen(port, () => {
            spinner.succeed(chalk.green('SSR server started'));
            console.log(chalk.cyan(`\n  ➜ Server:  http://localhost:${port}/\n`));
        });
    } catch (error) {
        spinner.fail(chalk.red('Failed to start SSR server'));
        console.error(error);
        process.exit(1);
    }
}
