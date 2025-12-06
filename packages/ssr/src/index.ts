import { SSRContext, SSRResult } from './types';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export * from './types';

export async function renderToString({ url, template, entry }: SSRContext): Promise<SSRResult> {
  // Create a JSDOM instance to simulate the browser environment
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    runScripts: 'dangerously'
  });

  // Set up global objects for the server environment
  global.window = dom.window as any;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;

  try {
    // Dynamically import the server entry point
    const { render } = await import(entry);
    
    // Execute the render function
    const result = await render(url);
    
    return {
      html: result.html || '',
      head: result.head || '',
      state: result.state
    };
  } catch (error) {
    console.error('SSR Error:', error);
    throw error;
  } finally {
    // Clean up global objects
    delete (global as any).window;
    delete (global as any).document;
    delete (global as any).navigator;
  }
}

export { smolVite } from './vite';
