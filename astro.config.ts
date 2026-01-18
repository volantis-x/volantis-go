import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";

// Astro Integrations
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import markdoc from "@astrojs/markdoc";
import icon from "astro-icon";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
// import remarkCustomBlocks from "./src/core/helpers/remark-custom-blocks.mjs";

// Project Internals
import configInitializer from "./src/core/bootstrap/integration";
import { Logger } from "./src/core/logger";
import { SUPPORTED_THEMES, type ThemeKey } from "./src/core/types/themes.ts";
import * as SiteDefaults from "./src/core/defaults/site.default.ts";

// ============================================================================
// 1. Constants & Paths
//    集中管理路径，避免魔法字符串
// ============================================================================
const PATHS = {
  root: process.cwd(),
  content: path.resolve(process.cwd(), "content"),
  example: path.resolve(process.cwd(), "example_content"),
  userConfig: path.resolve(
    process.cwd(),
    "content",
    "config",
    "site.config.ts",
  ),
  relativeUserConfig: "./content/config/site.config.ts",
};
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const APP_VERSION = packageJson.version;

// ============================================================================
// 2. Helper Functions
//    提取验证和逻辑处理函数
// ============================================================================

/**
 * 检查必要的目录结构是否存在。如果不存在，打印日志并退出进程。
 */
function ensureProjectStructure() {
  // 检查 content 目录
  if (!fs.existsSync(PATHS.content)) {
    Logger.error("Astro_Config_content_dir_not_found_error");
    Logger.info("Astro_Config_content_dir_separation");

    if (fs.existsSync(PATHS.example)) {
      Logger.info("Astro_Config_example_content_exists");
      Logger.info("Astro_Config_example_content_usage");
    }
    process.exit(1);
  }

  // 检查 site.config.ts
  if (!fs.existsSync(PATHS.userConfig)) {
    Logger.error(
      "Astro_Config_site_config_not_found_error",
      PATHS.relativeUserConfig,
    );
    Logger.info("Astro_Config_ensure_site_config_exists");

    const exampleConfigPath = path.resolve(
      PATHS.example,
      "config",
      "site.config.ts",
    );
    if (fs.existsSync(exampleConfigPath)) {
      Logger.info("Astro_Config_example_site_config_exists");
      Logger.info("Astro_Config_copy_example_site_config");
    } else {
      Logger.info("Astro_Config_example_site_config_not_found");
    }
    process.exit(1);
  }
}

/**
 * 安全地加载用户配置文件，如果失败则退出。
 */
async function loadUserConfig(): Promise<any> {
  try {
    // 使用 @vite-ignore 忽略动态导入警告
    // fix: Windows OS 不能使用变量传入，此处只能字符传入
    return await import(/* @vite-ignore */ "./content/config/site.config.ts");
  } catch (e: any) {
    Logger.error(
      "Astro_Config_load_failed_title_error",
      PATHS.relativeUserConfig,
    );
    Logger.error("Astro_Config_load_failed_ensure_file_error");
    Logger.error("Astro_Config_load_failed_original_error", e.message);
    process.exit(1);
  }
}

/**
 * 验证并解析主题名称。如果不合法，回退到默认主题并发出警告。
 */
function resolveThemeName(inputTheme: unknown): ThemeKey {
  const defaultTheme: ThemeKey = "base";

  // 简单的字符串清理
  const themeName =
    typeof inputTheme === "string" && inputTheme.trim() !== ""
      ? inputTheme.trim()
      : defaultTheme;

  // 检查是否在支持列表中
  if ((SUPPORTED_THEMES as readonly string[]).includes(themeName)) {
    return themeName as ThemeKey;
  }

  // 验证失败：打印警告并回退
  Logger.warn(
    "Active_Theme_invalid_user_them",
    `"${PATHS.relativeUserConfig} -> [UserTheme]"`,
  );

  return defaultTheme;
}

/**
 * 解析构建资源目录名称
 */
function resolveAssetsDir(userValue: string | undefined): string {
  const dirName = userValue ?? SiteDefaults.BUILD_ASSETS_DIR;
  // 确保以下划线开头（如果尚未包含）
  return dirName.startsWith("_") ? dirName : `_${dirName || "assets"}`;
}

// ============================================================================
// 3. Main Configuration Generator
//    主逻辑流程
// ============================================================================
async function generateAstroConfig() {
  // Step 1: 结构完整性检查
  ensureProjectStructure();

  // Step 2: 加载用户配置
  const userConfig = await loadUserConfig();

  // Step 3: 解析核心变量 (Site, Assets, Theme)
  const SITE = userConfig.SITE ?? SiteDefaults.SITE;
  const siteUrl =
    SITE && SITE !== "http://example.com" ? SITE : "http://localhost";

  const ASSETS_DIR = resolveAssetsDir(userConfig.BUILD_ASSETS_DIR);
  const ACTIVE_THEME_NAME = resolveThemeName(userConfig.UserTheme);

  // Step 4: 返回 Astro 配置
  return defineConfig({
    site: siteUrl,

    // 集成插件配置
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
        include: {
          tabler: ["*"],
          mdi: ["*"],
        },
      }),
    ],

    // Vite 构建配置
    vite: {
      define: {
        // 必须用 JSON.stringify 包裹，否则 Vite 会把 'base' 当作变量名而不是字符串
        __VOLANTIS_THEME__: JSON.stringify(ACTIVE_THEME_NAME),

        // 项目版本号
        __VOLANTIS_VERSION__: JSON.stringify(APP_VERSION),
      },
      resolve: {
        alias: {
          "@": "/src",
          "@com": "/src/core/components",
          "@THEME": `/src/core/themes/${ACTIVE_THEME_NAME}`,
        },
      },
    },

    // 预获取策略
    prefetch: true,

    // 强制所有 URL 以斜杠结尾 (SEO 标准)
    trailingSlash: "always",

    // 构建输出配置
    build: {
      assets: ASSETS_DIR,
    },
  });
}

// 导出最终配置
export default await generateAstroConfig();
