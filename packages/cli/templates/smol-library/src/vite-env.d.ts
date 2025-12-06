/// <reference types="vite/client" />

// Declare CSS modules with ?inline suffix
declare module '*.css?inline' {
    const content: string;
    export default content;
}

// Declare HTML modules with ?smol suffix (custom loader)
declare module '*.html?smol' {
    const template: (html: any) => any;
    export default template;
}

// Standard CSS modules
declare module '*.css' {
    const content: string;
    export default content;
}
