import { smolComponent, html } from 'smol.js';
import styles from './about.css?inline';
import template from './about.html?smol';

export default smolComponent({
  tag: 'app-about',
  styles,
  template() {
    return template(html);
  }
});
