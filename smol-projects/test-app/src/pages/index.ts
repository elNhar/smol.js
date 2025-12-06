import { smolComponent, html } from 'smol.js';
import styles from './index.css?inline';
import template from './index.html?smol';
import '../components/example-component';

export default smolComponent({
  tag: 'app-index',
  styles,
  template() {
    return template(html);
  }
});
