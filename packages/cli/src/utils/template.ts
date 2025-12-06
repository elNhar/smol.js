import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function copyTemplate(
    templateName: string,
    targetDir: string,
    variables: Record<string, string>
) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Resolve templates directory relative to this file
    // In dev: src/utils/template.ts -> templates/ is at ../../templates
    // In prod: dist/utils/template.js -> templates/ is at ../../templates (sibling to dist)
    const templateDir = path.resolve(__dirname, '../../templates', templateName);

    try {
        await fs.access(templateDir);
    } catch (error) {
        throw new Error(`Template '${templateName}' not found at ${templateDir}`);
    }

    await copyRecursive(templateDir, targetDir, variables);
}

async function copyRecursive(
    src: string,
    dest: string,
    variables: Record<string, string>
) {
    const stats = await fs.stat(src);

    if (stats.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const files = await fs.readdir(src);
        await Promise.all(
            files.map(file => copyRecursive(path.join(src, file), path.join(dest, file), variables))
        );
    } else {
        // Read file content
        let content = await fs.readFile(src, 'utf-8');

        // Replace placeholders
        Object.entries(variables).forEach(([key, value]) => {
            // Create a global regex for the placeholder
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        });

        await fs.writeFile(dest, content);
    }
}
