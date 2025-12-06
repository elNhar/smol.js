import type { Plugin } from 'vite';
import { readFileSync } from 'node:fs';


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

        async resolveId(id: string, importer?: string) {
            // Only handle .html files with ?smol query
            if (id.includes('.html?smol')) {
                const cleanId = id.replace('?smol', '');
                const resolved = await this.resolve(cleanId, importer);

                if (resolved) {
                    return resolved.id + '?smol';
                }
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

                // Create a function that uses 'with' to execute the template literal
                // We use new Function to avoid strict mode limitations on 'with'
                // and to allow dynamic variable resolution from the context
                const templateBody = `with(context) { return html\`${escapedContent}\`; }`;

                const code = `
                    export default function(html, context = {}) {
                        return new Function('html', 'context', ${JSON.stringify(templateBody)})(html, context);
                    }
                `;

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
