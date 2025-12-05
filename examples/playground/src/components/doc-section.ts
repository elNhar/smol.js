import { smolComponent, html } from 'smol.js';
import styles from './doc-section.scss?inline';

smolComponent({
  tag: 'doc-section',

  observedAttributes: ['title', 'category'],

  styles,

  template(ctx) {
    const category = ctx.element.getAttribute('category') || '';
    const title = ctx.element.getAttribute('title') || 'Section';

    return html`
      <div class="section">
        ${category ? html`<span class="category">${category}</span>` : ''}
        <h2>${title}</h2>
        <slot></slot>
      </div>
    `;
  }
});
