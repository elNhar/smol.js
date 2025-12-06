/// <reference types="vite/client" />

declare module '*?smol' {
    import { TemplateResult } from 'smol.js';
    const template: (html: any, context?: any) => TemplateResult;
    export default template;
}

declare module '*?inline' {
    const content: string;
    export default content;
}
