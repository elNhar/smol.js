import type { Signal } from './types';

/**
 * Create a reactive signal
 * 
 * Signals are lightweight reactive primitives that notify subscribers when their value changes.
 * 
 * @example
 * ```ts
 * const count = smolSignal(0);
 * 
 * // Subscribe to changes
 * count.subscribe((value) => console.log('Count:', value));
 * 
 * // Update value
 * count.value = 1; // logs "Count: 1"
 * ```
 */
export function smolSignal<T>(initialValue: T): Signal<T> {
    let _value = initialValue;
    const _subscribers = new Set<(value: T) => void>();

    const signal: Signal<T> = {
        get value() {
            return _value;
        },

        set value(newValue: T) {
            if (_value !== newValue) {
                _value = newValue;
                _subscribers.forEach(fn => fn(_value));
            }
        },

        subscribe(fn: (value: T) => void): () => void {
            _subscribers.add(fn);

            // Return unsubscribe function
            return () => {
                _subscribers.delete(fn);
            };
        },

        _subscribers
    };

    return signal;
}

/**
 * Create a computed signal that derives its value from other signals
 * 
 * @example
 * ```ts
 * const count = smolSignal(0);
 * const doubled = computed(() => count.value * 2);
 * ```
 */
export function computed<T>(fn: () => T): Signal<T> {
    const signal = smolSignal<T>(fn());

    // Note: This is a simplified version
    // A production version would track dependencies automatically

    return signal;
}

/**
 * Create an effect that runs when signals change
 * 
 * @example
 * ```ts
 * const count = smolSignal(0);
 * 
 * effect(() => {
 *   console.log('Count is:', count.value);
 * });
 * ```
 */
export function effect(fn: () => void): () => void {
    // Run immediately
    fn();

    // Note: This is a simplified version
    // A production version would track signal dependencies and re-run when they change

    // Return cleanup function
    return () => { };
}
