import type { SmolElement } from './types';
import { renderToString } from './html';

/**
 * Render a component to an HTML string with Declarative Shadow DOM
 * This is used for server-side rendering (SSR)
 * 
 * @example
 * ```ts
 * const html = renderComponentToString(MyCounter, { initialCount: 0 });
 * // Returns: <my-counter><template shadowrootmode="open">...</template></my-counter>
 * ```
 */
export function renderComponentToString(
    ComponentClass: typeof HTMLElement,
    attributes: Record<string, string> = {}
): string {
    // Create a temporary instance (without actually connecting to DOM)
    const instance = new ComponentClass() as SmolElement;

    // Set attributes if provided
    Object.entries(attributes).forEach(([key, value]) => {
        instance.setAttribute(key, value);
    });

    // Get the tag name from the constructor
    const tagName = (ComponentClass as any)._smolTag || 'unknown-element';

    // Get the template and styles
    const config = (ComponentClass as any)._smolConfig;
    const styles = config?.styles || '';

    // Manually call the lifecycle to initialize state
    if (config?.connected) {
        config.connected.call(instance);
    }

    // Render the template
    let templateHTML = '';
    if (config?.template) {
        const ctx = {
            emit: instance.emit.bind(instance),
            render: () => { },
            element: instance
        };
        const result = config.template.call(instance, ctx);

        if (typeof result === 'string') {
            templateHTML = result;
        } else if (result && result._isTemplateResult) {
            templateHTML = renderToString(result);
        }
    }

    // Build the Declarative Shadow DOM
    const shadowContent = `
    ${styles ? `<style>${styles}</style>` : ''}
    ${templateHTML}
  `.trim();

    // Build attribute string
    const attrString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
        .join(' ');

    // Return the complete HTML with Declarative Shadow DOM
    return `
<${tagName}${attrString ? ' ' + attrString : ''}>
  <template shadowrootmode="open">
    ${shadowContent}
  </template>
</${tagName}>
  `.trim();
}

/**
 * Escape attribute values
 */
function escapeAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Server-side render utility
 * Renders multiple components to HTML
 */
export function ssr(components: Array<{
    component: typeof HTMLElement;
    attributes?: Record<string, string>;
}>): string {
    return components
        .map(({ component, attributes }) => renderComponentToString(component, attributes))
        .join('\n');
}
