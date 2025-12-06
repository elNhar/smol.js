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
    if (globalThis.document && templateHTML) {
        // Parse the template HTML
        const template = document.createElement('template');
        template.innerHTML = templateHTML;

        // Recursively find and render nested components
        expandNestedComponents(template.content);

        templateHTML = template.innerHTML;
    }

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

/**
 * Recursively expand nested components
 */
function expandNestedComponents(node: Node | DocumentFragment): void {
    const children = Array.from(node.childNodes);

    children.forEach(child => {
        if (child.nodeType === 1) { // ELEMENT_NODE
            const element = child as HTMLElement;
            const tagName = element.tagName.toLowerCase();

            // Check if it's a registered custom element
            // We use globalThis to access the polyfilled registry in SSR
            if (globalThis.customElements && tagName.includes('-')) {
                const ComponentClass = customElements.get(tagName);

                if (ComponentClass) {
                    // Get attributes
                    const attributes: Record<string, string> = {};
                    Array.from(element.attributes).forEach(attr => {
                        attributes[attr.name] = attr.value;
                    });

                    // Render the nested component
                    const rendered = renderComponentToString(ComponentClass as typeof HTMLElement, attributes);

                    // Replace the element with the rendered HTML (which includes the tag)
                    // Since we can't easily replace outerHTML in a fragment with a string,
                    // we create a temporary container
                    const temp = document.createElement('div');
                    temp.innerHTML = rendered;

                    // Replace the child with the new rendered node
                    const newChild = temp.firstElementChild;
                    if (newChild) {
                        element.replaceWith(newChild);
                        // No need to recurse into newChild because renderComponentToString
                        // already handled its recursion internally
                        return;
                    }
                }
            }

            // Recurse for normal elements
            expandNestedComponents(element);
        }
    });
}
