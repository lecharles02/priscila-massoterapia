import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format } from 'prettier';
import * as astroPlugin from 'prettier-plugin-astro';

async function formatDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await formatDirectory(path);
    else if (/\.(astro|ts|mjs|css)$/.test(path)) {
      const source = await readFile(path, 'utf8');
      await writeFile(
        path,
        await format(source, {
          filepath: path,
          plugins: [astroPlugin],
          singleQuote: true,
        }),
      );
    }
  }
}
await formatDirectory('src');
await formatDirectory('scripts');
await writeFile(
  'astro.config.mjs',
  await format(await readFile('astro.config.mjs', 'utf8'), {
    filepath: 'astro.config.mjs',
    singleQuote: true,
  }),
);
console.log('Código formatado.');
