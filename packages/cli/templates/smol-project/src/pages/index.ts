import { smolComponent, css, html } from 'smol.js';

smolComponent({
  tag: 'app-index',
  styles: css`
    :host {
      display: block;
      padding: 20px;
    }
    h1 { color: #646cff; }
  `,
  template() {
    return html`
      <h1>Home Page</h1>
      <p>Welcome to the Smol.js app!</p>
      <a href="/about">Go to About</a>
    `;
  }
});
