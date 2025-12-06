import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve, dirname } from 'node:path';

/**
 * Vite plugin for importing HTML templates as smol.js template functions
 * 
 * This plugin allows you to write your component templates in separate .html files
 * and import them into your components.
 * 
 * @example
 * ```typescript
 * import template from './my-component.html?smol';
 * 
 * smolComponent({
 *   tag: 'my-component',
 *   template(ctx) {
 *     return template(html);
 *   }
 * });
 * ```
 */
export function smolTemplatePlugin(): Plugin {
    return {
        name: 'vite-plugin-smol-templates',
        enforce: 'pre',

        resolveId(id: string, importer?: string) {
            // Only handle .html files with ?smol query
            if (id.includes('.html?smol')) {
                // If it's a relative import, resolve it relative to the importer
                if (id.startsWith('.') && importer) {
                    const absolutePath = pathResolve(dirname(importer), id.replace('?smol', ''));
                    return absolutePath + '?smol';
                }
                return id;
            }
            return null;
        },

        load(id: string) {
            // Check if this is an HTML template with ?smol query
            if (!id.includes('.html?smol')) {
                return null;
            }

            // Remove query parameter to get the actual file path
            const filePath = id.replace(/\?smol$/, '');

            try {
                // Read the HTML file content
                const htmlContent = readFileSync(filePath, 'utf-8');

                // Transform the HTML into a JavaScript module
                // The template will be a function that takes the html tagged template function
                // and returns a TemplateResult

                // We need to preserve ${} interpolations as actual template literal placeholders
                // while escaping backticks in the HTML content
                const escapedContent = htmlContent
                    .replace(/\\/g, '\\\\')  // Escape backslashes
                    .replace(/`/g, '\\`');   // Escape backticks

                // Create a function that returns html`...`
                const code = `export default (html) => html\`${escapedContent}\`;`;

                return {
                    code,
                    map: null
                };
            } catch (error) {
                this.error(`Failed to load HTML template: ${filePath}\n${error}`);
                return null;
            }
        }
    };
}
