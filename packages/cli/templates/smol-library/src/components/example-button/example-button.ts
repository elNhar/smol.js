import { smolComponent, html } from 'smol.js';
import styles from './example-button.css?inline';
import template from './example-button.html?smol';

smolComponent({
  tag: 'example-button',
  styles,
  template(ctx) {
    return template(html);
  }
});
