import { smolComponent, html } from 'smol.js';
import styles from './demo-button.scss?inline';

smolComponent({
  tag: 'demo-button',

  observedAttributes: ['variant', 'disabled'],

  styles,

  template(ctx) {
    const variant = ctx.element.getAttribute('variant') || 'primary';
    const disabled = ctx.element.hasAttribute('disabled');

    const handleClick = () => {
      ctx.emit('buttonClick', { variant });
    };

    return html`
      <button class="${variant}" @click=${handleClick} ?disabled=${disabled}>
        <slot></slot>
      </button>
    `;
  }
});
