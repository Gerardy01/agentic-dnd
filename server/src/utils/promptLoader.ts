import fs from 'fs';
import path from 'path';

const promptCache = new Map<string, string>();

/**
 * Loads a prompt markdown file from the constants/prompt directory with in-memory caching.
 * Resolves properly in both development (src/) and production (dist/).
 */
export function loadPrompt(fileName: string): string {
  const cached = promptCache.get(fileName);
  if (cached !== undefined) {
    return cached;
  }

  // 1. Try relative to __dirname in src/ or dist/
  const relativePath = path.resolve(__dirname, '../constants/prompt', fileName);
  if (fs.existsSync(relativePath)) {
    const content = fs.readFileSync(relativePath, 'utf-8');
    promptCache.set(fileName, content);
    return content;
  }

  // 2. Fallback: resolve from cwd in development (server/src/constants/prompt)
  const cwdSrcPath = path.resolve(process.cwd(), 'src/constants/prompt', fileName);
  if (fs.existsSync(cwdSrcPath)) {
    const content = fs.readFileSync(cwdSrcPath, 'utf-8');
    promptCache.set(fileName, content);
    return content;
  }

  // 3. Fallback: resolve from cwd in production (server/dist/constants/prompt)
  const cwdDistPath = path.resolve(process.cwd(), 'dist/constants/prompt', fileName);
  if (fs.existsSync(cwdDistPath)) {
    const content = fs.readFileSync(cwdDistPath, 'utf-8');
    promptCache.set(fileName, content);
    return content;
  }

  throw new Error(`[PromptLoader] Prompt file "${fileName}" could not be found. Checked: ${relativePath}, ${cwdSrcPath}, ${cwdDistPath}`);
}
