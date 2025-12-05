import { smolComponent, html } from 'smol.js';
import styles from './demo-card.scss?inline';

smolComponent({
  tag: 'demo-card',

  observedAttributes: ['title', 'variant'],

  styles,

  template(ctx) {
    const title = ctx.element.getAttribute('title') || '';
    const variant = ctx.element.getAttribute('variant') || 'default';

    return html`
      <div class="card ${variant}">
        ${title ? html`<h3>${title}</h3>` : ''}
        <slot></slot>
      </div>
    `;
  }
});
