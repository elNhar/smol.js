import { smolComponent, css, html } from 'smol.js';

smolComponent({
  tag: 'app-about',
  styles: css`
    :host {
      display: block;
      padding: 20px;
    }
  `,
  template() {
    return html`
      <h1>About Page</h1>
      <p>This is a separate route managed by client-side navigation.</p>
      <a href="/">Back to Home</a>
    `;
  }
});
