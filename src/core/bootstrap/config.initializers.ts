import * as SiteDefaults from "../../core/defaults/site.default";
// import * as I18nDefaults from ...

/**
 * 全局配置注册表
 */
export const GLOBALS = {
  site: {
    defaults: SiteDefaults,
    userPath: "content/config/site.config.ts",
  },
  // i18n: { defaults: I18nDefaults, userPath: "..." }
} as const;

export type GlobalRegistry = typeof GLOBALS;
