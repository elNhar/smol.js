import { smolComponent, smolSignal, html } from 'smol.js';
import styles from './counter-component.css?inline';
import template from './counter-component.html?smol';

/**
 * Counter component with increment, decrement, and reset functionality
 * 
 * @element counter-component
 * @fires increment - Fired when + button is clicked
 * @fires decrement - Fired when - button is clicked
 * @fires reset - Fired when reset button is clicked
 * @attr initial-count - Initial count value (default: 0)
 */
smolComponent({
    tag: 'counter-component',

    observedAttributes: ['initial-count'],

    styles,

    connected() {
        const initialCount = parseInt(this.getAttribute('initial-count') || '0', 10);

        // Initialize the count signal on the component instance
        (this as any).count = smolSignal(initialCount);

        // Subscribe to changes and trigger re-render
        (this as any).count.subscribe(() => this.render());

        // Attach event handlers to the component instance
        (this as any).increment = () => {
            (this as any).count.value = (this as any).count.value + 1;
            this.emit('increment');
        };

        (this as any).decrement = () => {
            (this as any).count.value = (this as any).count.value - 1;
            this.emit('decrement');
        };

        (this as any).reset = () => {
            (this as any).count.value = initialCount;
            this.emit('reset');
        };
    },

    template(ctx) {
        return template.call(this, html);
    }
});
