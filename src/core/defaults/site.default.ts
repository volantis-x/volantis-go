// 这里放的是 “绝对保底” 的默认值
// 当用户把 content/config/site.config.ts 删了，或者里面写错了，就用这里的默认值

import type { Config } from "../types/site";

export const SITE: string = "http://example.com";
export const BUILD_ASSETS_DIR: string = "_astro";
export const UserTheme: string = "base";

export const CONFIG: Config = {
  FAVICON: "favicon.ico",
  DEFAULT_AUTHOR: "Admin",
  ADD_TITLE: true,
  DELIMITER: false,
  VIEW_TRANSITIONS: false,
  USE_SMALLER_FONT: false,
  // 默认版本号都开启，用户可以在自己的 config 里覆盖为 false
  SHOW_VOLANTIS_VERSION: true,
  SHOW_ASTRO_GENERATOR: true,
};
