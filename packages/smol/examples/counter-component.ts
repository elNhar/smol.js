import { smolComponent, html, smolSignal } from '../src/index';
import styles from './counter-component.css?inline';
import template from './counter-component.html?smol';

/**
 * Example component demonstrating external HTML template usage
 * 
 * This shows how to:
 * - Import a template from a separate .html file
 * - Import styles from a separate .css file
 * - Use reactive signals with external templates
 * - Handle events from external templates
 */
smolComponent({
    tag: 'counter-component',

    styles,

    connected() {
        // Initialize the count signal
        (this as any).count = smolSignal(0);

        // Subscribe to changes and trigger re-render
        (this as any).count.subscribe(() => this.render());
    },

    template(ctx) {
        // Use the imported external template
        return template(html);
    }
});
