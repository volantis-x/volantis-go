// 这里放的是 “绝对保底” 的默认值
// 当用户把 content/config/site.config.ts 删了，或者里面写错了，就用这里的默认值

import type { Config, Metadata } from "@/core/types/config";

export const SITE: string = "http://example.com";
export const BUILD_ASSETS_DIR: string = "_astro";
export const UserTheme: string = "base";

export const CONFIG: Config = {
  DIR: "ltr",
  FAVICON: "favicon.ico",
  DEFAULT_LOCALE: "zh-cn",
  DEFAULT_TITLE: "Volantis GO",
  DEFAULT_DESCRIPTION: "A content site built with Astro",
  DEFAULT_AUTHOR: "Admin",
  ADD_TITLE: true,
  DELIMITER: false,
  VIEW_TRANSITIONS: true,
  USE_SMALLER_FONT: false,
};

export const HOME: Metadata = {
  DEFAULT_TITLE: "Home",
  DEFAULT_DESCRIPTION: "Welcome to Volantis GO",
};
