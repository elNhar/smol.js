import type { TemplateResult } from './types';

/**
 * Tagged template literal for HTML templates
 * 
 * @example
 * ```ts
 * const template = html`<div>${value}</div>`;
 * ```
 */
export function html(strings: TemplateStringsArray, ...values: any[]): TemplateResult {
    return {
        strings,
        values,
        _isTemplateResult: true
    };
}

/**
 * Check if a value is a TemplateResult
 */
export function isTemplateResult(value: any): value is TemplateResult {
    return value && value._isTemplateResult === true;
}

/**
 * Render a template result to an HTML string
 * Used for SSR or initial rendering
 */
export function renderToString(template: TemplateResult): string {
    let result = '';

    for (let i = 0; i < template.strings.length; i++) {
        result += template.strings[i];

        if (i < template.values.length) {
            const value = template.values[i];
            result += stringifyValue(value);
        }
    }

    return result;
}

/**
 * Convert a value to a string for HTML output
 */
function stringifyValue(value: any): string {
    if (value == null) {
        return '';
    }

    if (isTemplateResult(value)) {
        return renderToString(value);
    }

    if (Array.isArray(value)) {
        return value.map(stringifyValue).join('');
    }

    if (typeof value === 'boolean') {
        return value ? '' : '';
    }

    if (typeof value === 'function') {
        // Skip functions (likely event handlers)
        return '';
    }

    return escapeHtml(String(value));
}

/**
 * Escape HTML special characters
 */
function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Render a template to a DOM node
 * This handles event listeners, attributes, and text content
 * IMPORTANT: Preserves existing <style> elements in shadow DOM
 */
export function render(template: TemplateResult, container: HTMLElement | ShadowRoot): void {
    // CRITICAL FIX: Preserve existing style elements before wiping innerHTML
    const existingStyles = Array.from(container.querySelectorAll('style'));

    // Build HTML first, replacing expressions with markers
    let html = '';
    const markers: Array<{ index: number; value: any; type: string }> = [];
    let markerIndex = 0;

    for (let i = 0; i < template.strings.length; i++) {
        const str = template.strings[i];
        html += str;

        if (i < template.values.length) {
            const value = template.values[i];

            // Detect what kind of binding this is based on the preceding text
            const lastPart = str.trim();

            // Event handler: @event=${handler}
            if (lastPart.endsWith('@click=') || lastPart.endsWith('@change=') || lastPart.includes('@')) {
                markers.push({ index: markerIndex, value, type: 'event' });
                html += `"__smol_event_${markerIndex}__"`;
                markerIndex++;
            }
            // Boolean attribute: ?disabled=${bool}
            else if (lastPart.endsWith('?disabled=') || lastPart.endsWith('?checked=') || lastPart.includes('?')) {
                markers.push({ index: markerIndex, value, type: 'boolean' });
                html += `"__smol_bool_${markerIndex}__"`;
                markerIndex++;
            }
            // Regular interpolation
            else {
                html += stringifyValue(value);
            }
        }
    }

    // Set innerHTML (this wipes everything including styles)
    container.innerHTML = html;

    // Re-add the preserved style elements at the beginning
    existingStyles.forEach(style => {
        container.insertBefore(style, container.firstChild);
    });

    // Attach event listeners and handle boolean attributes
    markers.forEach(marker => {
        if (marker.type === 'event') {
            // Find elements with event markers
            const markerAttr = `__smol_event_${marker.index}__`;
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);

            let node;
            while ((node = walker.nextNode())) {
                const element = node as Element;
                for (const attr of Array.from(element.attributes)) {
                    if (attr.value === markerAttr) {
                        const eventName = attr.name.replace('@', '');
                        element.removeAttribute(attr.name);

                        if (typeof marker.value === 'function') {
                            element.addEventListener(eventName, marker.value as EventListener);
                        }
                    }
                }
            }
        } else if (marker.type === 'boolean') {
            // Handle boolean attributes
            const markerAttr = `__smol_bool_${marker.index}__`;
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);

            let node;
            while ((node = walker.nextNode())) {
                const element = node as Element;
                for (const attr of Array.from(element.attributes)) {
                    if (attr.value === markerAttr) {
                        const attrName = attr.name.replace('?', '');
                        element.removeAttribute(attr.name);

                        if (marker.value) {
                            element.setAttribute(attrName, '');
                        }
                    }
                }
            }
        }
    });
}
