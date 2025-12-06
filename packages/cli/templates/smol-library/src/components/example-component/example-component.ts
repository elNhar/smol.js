import { smolComponent } from 'smol.js';
import template from './example-component.html';
import styles from './example-component.css';

/**
 * Example Web Component
 * 
 * @element example-component
 * 
 * @attr {string} title - The title to display
 * 
 * @slot - Default slot for content
 * 
 * @cssprop --example-primary-color - Primary color for the component
 * @cssprop --example-padding - Padding around the component
 */
smolComponent({
  tag: 'example-component',

  // Observed attributes
  observedAttributes: ['title', 'variant'],

  // Component styles
  styles,

  // Template function
  template
});

