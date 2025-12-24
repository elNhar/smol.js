import type { SmolElement } from './types';

/**
 * Hydration utilities for SSR-rendered components
 * 
 * Hydration attaches JavaScript behavior to server-rendered HTML
 * without destroying and recreating the DOM.
 */

/**
 * Check if a component was server-rendered (has Declarative Shadow DOM)
 */
export function isServerRendered(element: HTMLElement): boolean {
    return element.shadowRoot !== null && !element.shadowRoot.mode;
}

/**
 * Hydrate a server-rendered component
 * 
 * This attaches event listeners and sets up reactivity
 * without re-rendering the component.
 */
export function hydrateComponent(element: SmolElement): void {
    // If not server-rendered, skip hydration
    if (!element.shadowRoot) {
        return;
    }

    // Mark as hydrated to prevent full re-render
    (element as any)._hydrated = true;

    // The component's connected callback will handle:
    // 1. Setting up reactive state
    // 2. Subscribing to state changes
    // 3. Calling render() - but render() should check _hydrated flag

    // After hydration, attach event listeners
    attachEventListeners(element);
}

/**
 * Attach event listeners to a hydrated component
 * 
 * This walks the shadow DOM and finds elements with data-smol-event attributes
 * that were set during SSR.
 */
function attachEventListeners(element: SmolElement): void {
    if (!element.shadowRoot) return;

    // Find all elements with event listener markers
    const walker = document.createTreeWalker(
        element.shadowRoot,
        NodeFilter.SHOW_ELEMENT
    );

    const elementsWithEvents: Array<{ element: Element; events: Map<string, string> }> = [];

    let node;
    while ((node = walker.nextNode())) {
        const el = node as Element;
        const events = new Map<string, string>();

        // Check for data-smol-* attributes that mark event listeners
        for (const attr of Array.from(el.attributes)) {
            if (attr.name.startsWith('data-smol-event-')) {
                const eventName = attr.name.replace('data-smol-event-', '');
                events.set(eventName, attr.value);
            }
        }

        if (events.size > 0) {
            elementsWithEvents.push({ element: el, events });
        }
    }

    // Attach event listeners
    // Note: The actual handler functions need to be retrieved from the component's config
    // This is a simplified version - in production, you'd serialize handler references
    elementsWithEvents.forEach(({ element: el, events }) => {
        events.forEach((handlerId, eventName) => {
            // In a full implementation, you'd look up the handler by handlerId
            // For now, this is a placeholder
            console.warn(`Hydration: Found event listener ${eventName} but handler lookup not implemented`);
        });
    });
}

/**
 * Hydrate all smol components on the page
 * 
 * Call this after the page loads to hydrate all server-rendered components.
 */
export function hydrateAll(): void {
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
        // Check if this is a custom element (has a hyphen in the tag name)
        if (element.tagName.includes('-') && element.shadowRoot) {
            hydrateComponent(element as SmolElement);
        }
    });
}
