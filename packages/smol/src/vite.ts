// Export the Vite plugin for external HTML templates
// This is in a separate entry point to avoid bundling Node.js dependencies
// into the browser-facing library
export { smolTemplatePlugin } from './vite-plugin-smol-templates.js';
