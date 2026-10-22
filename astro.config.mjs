import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://priscilamassagemsp.com.br',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
