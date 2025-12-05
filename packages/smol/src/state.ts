import type { State } from './types';

/**
 * Create a reactive state object using Proxy
 * 
 * Unlike signals, state objects are reactive objects that track changes to any property.
 * 
 * @example
 * ```ts
 * const state = smolState({
 *   count: 0,
 *   name: 'John'
 * });
 * 
 * state.subscribe(() => {
 *   console.log('State changed:', state.data);
 * });
 * 
 * state.data.count++; // triggers subscribers
 * ```
 */
export function smolState<T extends object>(initialValue: T): State<T> {
    const _subscribers = new Set<() => void>();

    const notify = () => {
        _subscribers.forEach(fn => fn());
    };

    const data = new Proxy(initialValue, {
        set(target, property, value) {
            const oldValue = (target as any)[property];

            if (oldValue !== value) {
                (target as any)[property] = value;
                notify();
            }

            return true;
        },

        deleteProperty(target, property) {
            if (property in target) {
                delete (target as any)[property];
                notify();
            }

            return true;
        }
    });

    const state: State<T> = {
        data,

        subscribe(fn: () => void): () => void {
            _subscribers.add(fn);

            // Return unsubscribe function
            return () => {
                _subscribers.delete(fn);
            };
        },

        _subscribers
    };

    return state;
}
