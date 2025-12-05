import { smolComponent, html, smolSignal } from 'smol.js';
import styles from './demo-counter.scss?inline';

smolComponent({
  tag: 'demo-counter',

  styles,

  connected() {
    (this as any).count = smolSignal(0);
    (this as any).count.subscribe(() => this.render());
  },

  template(ctx) {
    const count = (ctx as any).count;

    return html`
      <div class="counter">
        <div class="count">${count.value}</div>
        <div class="controls">
          <button @click=${() => count.value--} ?disabled=${count.value <= 0}>
            −
          </button>
          <button @click=${() => count.value++}>
            +
          </button>
        </div>
      </div>
    `;
  }
});
