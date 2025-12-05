/**
 * Tagged template literal for CSS styles
 * 
 * @example
 * ```ts
 * const styles = css`
 *   :host {
 *     display: block;
 *   }
 * `;
 * ```
 */
export function css(strings: TemplateStringsArray, ...values: any[]): string {
    let result = '';

    for (let i = 0; i < strings.length; i++) {
        result += strings[i];

        if (i < values.length) {
            result += String(values[i]);
        }
    }

    return result.trim();
}
