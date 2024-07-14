import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],
  // prefetch 开启链接预加载
  prefetch: true,
  markdown: {
    // 在 md 和 mdx 文件中语义化 emoji 图标
    rehypePlugins: [rehypeAccessibleEmojis]
  }
});