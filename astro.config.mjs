// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    markdoc(),
    keystatic({ cloud: { project: 'martindiesel/martindiesel' } }),
  ],
  site: 'https://martindiesel.sk',
});
