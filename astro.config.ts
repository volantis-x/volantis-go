import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import fs from "node:fs";
import path from "node:path";
import icon from "astro-icon";
import configInitializer from "./src/core/bootstrap/integration";
import { logError, logInfo } from "./src/config/astro.config.messages.mjs";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
// import remarkCustomBlocks from "./src/helpers/lib/remark-custom-blocks.mjs";

const contentDir = path.resolve(process.cwd(), "content");
const exampleContentDir = path.resolve(process.cwd(), "example_content");
const siteConfigPath = path.resolve(contentDir, "config", "site.config.ts");
const relativeSiteConfigPath = path.relative(process.cwd(), siteConfigPath);

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

async function generateAstroConfig() {
  let userSiteConfigModule;
  let themeModule;
  try {
    // TypeScript 动态导入
    userSiteConfigModule = await import(
      /* @vite-ignore */ "./content/config/site.config"
    );
    themeModule = await import(/* @vite-ignore */ "./src/helpers/lib/theme");
  } catch (e: any) {
    logError("error_jiti_load_failed_title", relativeSiteConfigPath);
    logError("error_jiti_load_failed_ensure_file");
    logError("error_jiti_load_failed_original_error", e.message);
    process.exit(1);
  }

  const {
    SITE,
    BUILD_ASSETS_DIR,
  } = userSiteConfigModule;

  const { ACTIVE_THEME_NAME } = themeModule;

  const CUSTOM_SITE =
    SITE !== undefined && SITE !== "http://example.com" && SITE;
  const siteUrl = CUSTOM_SITE || "http://localhost";

  const ASSETS_DIR = BUILD_ASSETS_DIR?.startsWith("_")
    ? BUILD_ASSETS_DIR
    : `_${BUILD_ASSETS_DIR || "assets"}`;

  return defineConfig({
    site: siteUrl,
    integrations: [
      configInitializer(),
      mdx({
        // remarkPlugins: [remarkCustomBlocks],
        rehypePlugins: [rehypeAccessibleEmojis],
      }),
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
          "@THEME": `/src/themes/${ACTIVE_THEME_NAME}`,
          "@userConfig": "/content/config",
          "@components": "/src/components",
          "@layouts": "/src/layouts",
          "@layoutComps": "/src/layouts/components",
          "@helpers": "/src/helpers",
          "@lib": "/src/helpers/lib",
          "@utils": "/src/helpers/utils",
          "@config": "/src/config",
          "@types": "/src/types",
        },
      },
    },
    prefetch: true,
    build: {
      assets: ASSETS_DIR,
    },
  });
}

export default await generateAstroConfig();
