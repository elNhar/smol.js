// Core TypeScript type definitions for smol.js

export interface SmolComponentConfig {
    /** The custom element tag name (must contain a hyphen) */
    tag: string;

    /** Shadow DOM mode */
    mode?: 'open' | 'closed';

    /** List of attributes to observe for changes */
    observedAttributes?: string[];

    /** Component styles (use css`` tagged template) */
    styles?: string;

    /** Template function that returns HTML */
    template?: (this: SmolElement, ctx: SmolContext) => string | TemplateResult;

    /** Lifecycle: element connected to DOM */
    connected?: (this: SmolElement) => void;

    /** Lifecycle: element disconnected from DOM */
    disconnected?: (this: SmolElement) => void;

    /** Lifecycle: observed attribute changed */
    attributeChanged?: (this: SmolElement, name: string, oldValue: string | null, newValue: string | null) => void;
}

export interface SmolContext {
    /** Emit a custom event */
    emit: (name: string, detail?: any) => void;

    /** Trigger a re-render */
    render: () => void;

    /** Access to element properties */
    [key: string]: any;
}

export interface SmolElement extends HTMLElement {
    /** Trigger a re-render of the component */
    render(): void;

    /** Emit a custom event from the component */
    emit(name: string, detail?: any): void;

    /** Access to the shadow root */
    readonly shadowRoot: ShadowRoot;
}

export interface TemplateResult {
    strings: TemplateStringsArray;
    values: any[];
    _isTemplateResult: true;
}

export interface Signal<T> {
    /** Get the current value */
    get value(): T;

    /** Set a new value */
    set value(newValue: T);

    /** Subscribe to value changes */
    subscribe(fn: (value: T) => void): () => void;

    /** Internal subscribers */
    _subscribers: Set<(value: T) => void>;
}

export interface State<T extends object> {
    /** The proxied state object */
    data: T;

    /** Subscribe to any state change */
    subscribe(fn: () => void): () => void;

    /** Internal subscribers */
    _subscribers: Set<() => void>;
}

export interface SmolServiceConfig<T> {
    /** Unique service name */
    name: string;

    /** Factory function to create the service */
    factory: () => T;

    /** Whether this is a singleton (default: true) */
    singleton?: boolean;
}
