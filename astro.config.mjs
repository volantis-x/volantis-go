import { defineConfig } from "astro/config";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import { SITE } from "./src/content/site.config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import markdoc from "@astrojs/markdoc";

// 判断是否有设置网站地址
// Determine whether a website address has been set
const CUSTOM_SITE = SITE !== undefined && SITE !== "http://example.com" && SITE;
const site = CUSTOM_SITE || "http://localhost";

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [mdx(), sitemap(), markdoc()],
  // prefetch 开启链接预加载
  prefetch: true,
  markdown: {
    // 在 md 和 mdx 文件中语义化 emoji 图标
    rehypePlugins: [rehypeAccessibleEmojis],
  },
});