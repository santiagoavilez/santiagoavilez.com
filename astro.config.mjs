import { defineConfig, squooshImageService } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://santiagoavilez.com",
  output: "hybrid",
  adapter: vercel({
    runtime: 'nodejs22.x'
  }),
  integrations: [tailwind(), mdx(), sitemap(), react()],
});