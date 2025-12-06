import { smolComponent, html } from 'smol.js';
import styles from './example-component.css?inline';
import template from './example-component.html?smol';

smolComponent({
    tag: 'example-component',

    observedAttributes: ['title'],

    styles,

    template(ctx) {
        const title = ctx.element.getAttribute('title') || 'Hello World';
        return template(html, { title });
    }
});
