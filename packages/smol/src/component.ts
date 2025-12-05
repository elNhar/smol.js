import type { SmolComponentConfig, SmolElement, SmolContext } from './types';
import { render, renderToString, isTemplateResult } from './html';

/**
 * Create a custom Web Component
 * 
 * This function creates a custom element class and automatically registers it.
 * It handles Shadow DOM, lifecycle callbacks, and template rendering.
 * 
 * @example
 * ```ts
 * const MyButton = smolComponent({
 *   tag: 'my-button',
 *   observedAttributes: ['variant'],
 *   
 *   styles: css`
 *     button { padding: 0.5rem 1rem; }
 *   `,
 *   
 *   template(ctx) {
 *     return html`
 *       <button>
 *         <slot></slot>
 *       </button>
 *     `;
 *   }
 * });
 * ```
 */
export function smolComponent(config: SmolComponentConfig): typeof HTMLElement {
    const {
        tag,
        mode = 'open',
        observedAttributes = [],
        styles = '',
        template,
        connected,
        disconnected,
        attributeChanged
    } = config;

    // Validate tag name
    if (!tag.includes('-')) {
        throw new Error(`Custom element tag names must contain a hyphen: "${tag}"`);
    }

    class SmolCustomElement extends HTMLElement implements SmolElement {
        declare shadowRoot: ShadowRoot;

        static get observedAttributes() {
            return observedAttributes;
        }

        constructor() {
            super();

            // Check if Shadow DOM already exists (from SSR Declarative Shadow DOM)
            if (!this.shadowRoot) {
                this.attachShadow({ mode });
            }

            // Inject styles if provided
            if (styles && this.shadowRoot) {
                const styleElement = document.createElement('style');
                styleElement.textContent = styles;
                this.shadowRoot.appendChild(styleElement);
            }
        }

        connectedCallback() {
            // Call user-defined connected lifecycle FIRST
            // This allows setup of signals and reactive state before first render
            if (connected) {
                connected.call(this);
            }

            // Then render the component
            this.render();
        }

        disconnectedCallback() {
            // Call user-defined disconnected lifecycle
            if (disconnected) {
                disconnected.call(this);
            }
        }

        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            // Re-render on attribute change
            if (this.isConnected) {
                this.render();
            }

            // Call user-defined attribute changed lifecycle
            if (attributeChanged) {
                attributeChanged.call(this, name, oldValue, newValue);
            }
        }

        /**
         * Render the component template
         */
        render(): void {
            if (!template || !this.shadowRoot) {
                return;
            }

            const ctx: SmolContext = {
                emit: this.emit.bind(this),
                render: this.render.bind(this),
                // Add element as context (for accessing attributes, etc.)
                element: this
            };

            const result = template.call(this, ctx);

            if (!result) {
                return;
            }

            if (typeof result === 'string') {
                this.shadowRoot.innerHTML = result;
            } else if (isTemplateResult(result)) {
                render(result, this.shadowRoot);
            }
        }

        /**
         * Emit a custom event
         */
        emit(name: string, detail?: any): void {
            this.dispatchEvent(new CustomEvent(name, {
                detail,
                bubbles: true,
                composed: true
            }));
        }
    }

    // Store config and tag name on the class for SSR
    (SmolCustomElement as any)._smolConfig = config;
    (SmolCustomElement as any)._smolTag = tag;

    // Auto-register the custom element
    if (!customElements.get(tag)) {
        customElements.define(tag, SmolCustomElement);
    }

    return SmolCustomElement;
}
