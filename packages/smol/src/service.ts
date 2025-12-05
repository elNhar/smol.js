import type { SmolServiceConfig } from './types';

// Global service registry
const serviceRegistry = new Map<string, any>();

/**
 * Create a service (singleton by default)
 * 
 * Services provide shared functionality across components.
 * 
 * @example
 * ```ts
 * const ApiService = smolService({
 *   name: 'ApiService',
 *   factory: () => ({
 *     async fetchData(url: string) {
 *       const res = await fetch(url);
 *       return res.json();
 *     }
 *   })
 * });
 * 
 * // Use in component:
 * const api = inject('ApiService');
 * ```
 */
export function smolService<T>(config: SmolServiceConfig<T>): T {
    const { name, factory, singleton = true } = config;

    if (singleton) {
        // Return existing instance if available
        if (serviceRegistry.has(name)) {
            return serviceRegistry.get(name);
        }

        // Create and store new instance
        const instance = factory();
        serviceRegistry.set(name, instance);
        return instance;
    }

    // Always create new instance for non-singletons
    return factory();
}

/**
 * Inject a service by name
 * 
 * @example
 * ```ts
 * const api = inject<ApiService>('ApiService');
 * ```
 */
export function inject<T = any>(name: string): T {
    if (!serviceRegistry.has(name)) {
        throw new Error(`Service "${name}" not found. Did you forget to create it with smolService()?`);
    }

    return serviceRegistry.get(name);
}

/**
 * Clear all services (useful for testing)
 */
export function clearServices(): void {
    serviceRegistry.clear();
}
