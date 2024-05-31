import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import image from "@astrojs/image";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: 'https://santiagoavilez.com',
  integrations: [tailwind(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), mdx(), sitemap(), react()]
});