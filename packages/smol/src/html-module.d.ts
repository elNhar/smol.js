/**
 * Type declarations for importing HTML templates with ?smol query parameter
 * 
 * This allows TypeScript to recognize .html?smol imports
 */

declare module '*.html?smol' {
    import type { TemplateResult } from './types';

    /**
     * Imported HTML template function
     * Takes the html tagged template function and returns a TemplateResult
     */
    const template: (html: (strings: TemplateStringsArray, ...values: any[]) => TemplateResult) => TemplateResult;
    export default template;
}
