import { defineConfig } from "astro/config";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import {
  UserTheme as rawUserTheme,
  SITE,
  BUILD_ASSETS_DIR,
} from "./content/config/site.config.ts";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";

// -- 声明所有的主题名称数组，请同步 src/type/config.ts 里的 SUPPORTED_THEMES 值 --
// -- Array of all supported theme names. Keep this in sync with SUPPORTED_THEMES in src/types/config.ts --
const ASTRO_CONFIG_SUPPORTED_THEMES = ["base", "custom"];

// -- 验证主题名的逻辑 --
// -- Logic for validating the theme name --
function getValidatedThemeNameInAstroConfig() {
  const themeToValidate =
    typeof rawUserTheme === "string" ? rawUserTheme : "base";

  if (!ASTRO_CONFIG_SUPPORTED_THEMES.includes(themeToValidate)) {
    console.warn(
      `\u001b[33m [ USER CONFIG WARNING ]: \u001b[0m UserTheme ("${themeToValidate}") in "content/config/site.config.ts" is invalid or not in ASTRO_CONFIG_SUPPORTED_THEMES. Using default theme "base".`,
    );
    // 确保 "base" 存在于 ASTRO_CONFIG_SUPPORTED_THEMES 中，或者直接返回 "base"
    return ASTRO_CONFIG_SUPPORTED_THEMES.includes("base")
      ? "base"
      : ASTRO_CONFIG_SUPPORTED_THEMES[0] || "base";
  }
  return themeToValidate;
}

const ACTIVE_THEME_NAME_FOR_VITE = getValidatedThemeNameInAstroConfig();

// 判断是否有设置网站地址
// Determine whether a website address has been set
const CUSTOM_SITE = SITE !== undefined && SITE !== "http://example.com" && SITE;
const siteUrl = CUSTOM_SITE || "http://localhost";

const ASSETS_DIR = BUILD_ASSETS_DIR.startsWith("_")
  ? BUILD_ASSETS_DIR
  : `_${BUILD_ASSETS_DIR}`;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    mdx(),
    sitemap(),
    markdoc(),
    icon({
      iconDir: "content/icons",
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@THEME": `/src/themes/${ACTIVE_THEME_NAME_FOR_VITE}`,
        "@userConfig": "/content/config",
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@layoutComps": "/src/layouts/components",
        "@helpers": "/src/helpers",
        "@lib": "/src/helpers/lib",
        "@utils": "/src/helpers/utils",
        "@helpersConfig": "/src/helpers/config",
        "@types": "/src/types",
      },
    },
  },
  // prefetch 开启链接预加载
  prefetch: true,
  markdown: {
    // 在 md 和 mdx 文件中语义化 emoji 图标
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  build: {
    assets: ASSETS_DIR,
  },
});
