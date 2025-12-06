
export interface Route {
    path: string;
    component: string;
    load: () => Promise<any>;
}

const pages = import.meta.glob('./pages/**/*.ts');

export const routes: Route[] = Object.keys(pages).map((path) => {
    // ./pages/index.ts -> /
    // ./pages/about.ts -> /about
    // ./pages/users/[id].ts -> /users/:id (Simulated for now, simple regex later if needed)

    const name = path.match(/\.\/pages\/(.*)\.ts$/)?.[1];
    let routePath = name === 'index' ? '/' : `/${name}`;

    return {
        path: routePath,
        component: `app-${name?.replace('/', '-')}`, // e.g. app-index, app-about
        load: pages[path] as () => Promise<any>
    };
});

export function matchRoute(url: string) {
    return routes.find(r => r.path === url) || routes.find(r => r.path === '/404');
}
