import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import {
  logError,
  logInfo,
  logWarning,
  logDebug,
} from "./src/config/astro.config.messages.mjs";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url);

// --- 检查 ./content 目录是否存在 ---
const contentDir = path.resolve(process.cwd(), "content");
const exampleContentDir = path.resolve(process.cwd(), "example_content");
const siteConfigPath = path.resolve(contentDir, "config", "site.config.ts");
const relativeSiteConfigPath = path.relative(process.cwd(), siteConfigPath); // 用于更友好的 console 提示

if (!fs.existsSync(contentDir)) {
  logError("error_content_dir_not_found");
  logInfo("info_content_dir_separation");
  if (fs.existsSync(exampleContentDir)) {
    logInfo("info_example_content_exists");
    logInfo("info_example_content_usage");
  }
  process.exit(1);
} else if (!fs.existsSync(siteConfigPath)) {
  logError("error_site_config_not_found", relativeSiteConfigPath);
  logInfo("info_ensure_site_config_exists");
  if (
    fs.existsSync(path.resolve(exampleContentDir, "config", "site.config.ts"))
  ) {
    logInfo("info_example_site_config_exists");
    logInfo("info_copy_example_site_config");
  } else {
    logInfo("info_example_site_config_not_found");
  }
  process.exit(1);
}
// --- 检查结束 ---

import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";

// -- 声明所有的主题名称数组，请同步 src/type/config.ts 里的 SUPPORTED_THEMES 值 --
// -- Array of all supported theme names. Keep this in sync with SUPPORTED_THEMES in src/types/config.ts --
const ASTRO_CONFIG_SUPPORTED_THEMES = ["base", "custom"];

// 将 defineConfig 的调用放到一个异步函数中
async function generateAstroConfig() {
  // --- 使用 jiti 来加载 .ts 文件 ---
  let userSiteConfigModule;
  try {
    userSiteConfigModule = await jiti.import(siteConfigPath);
  } catch (e) {
    logError("error_jiti_load_failed_title", relativeSiteConfigPath);
    logError("error_jiti_load_failed_ensure_file");
    logError("error_jiti_load_failed_original_error", e.message);
    process.exit(1);
  }

  const {
    UserTheme: rawUserTheme,
    SITE,
    BUILD_ASSETS_DIR,
  } = userSiteConfigModule;
  // ------------------------------------

  function getValidatedThemeNameInAstroConfig() {
    const themeToValidate =
      typeof rawUserTheme === "string" ? rawUserTheme : "base";
    if (!ASTRO_CONFIG_SUPPORTED_THEMES.includes(themeToValidate)) {
      logWarning(
        "warn_invalid_theme",
        themeToValidate,
        ASTRO_CONFIG_SUPPORTED_THEMES.join(", "),
        "base",
      );
      return ASTRO_CONFIG_SUPPORTED_THEMES.includes("base")
        ? "base"
        : ASTRO_CONFIG_SUPPORTED_THEMES[0] || "base";
    }
    return themeToValidate;
  }
  const ACTIVE_THEME_NAME_FOR_VITE = getValidatedThemeNameInAstroConfig();

  const CUSTOM_SITE =
    SITE !== undefined && SITE !== "http://example.com" && SITE;
  const siteUrl = CUSTOM_SITE || "http://localhost";

  const ASSETS_DIR = BUILD_ASSETS_DIR.startsWith("_")
    ? BUILD_ASSETS_DIR
    : `_${BUILD_ASSETS_DIR}`;

  logDebug("debug_active_theme_for_vite", ACTIVE_THEME_NAME_FOR_VITE);
  logDebug(
    "debug_theme_resolve_path",
    `/src/themes/${ACTIVE_THEME_NAME_FOR_VITE}`,
  );

  return defineConfig({
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
          "@appConfig": "/src/config",
          "@types": "/src/types",
        },
      },
    },
    prefetch: true,
    markdown: {
      rehypePlugins: [rehypeAccessibleEmojis],
    },
    build: {
      assets: ASSETS_DIR,
    },
  });
}

export default generateAstroConfig();
