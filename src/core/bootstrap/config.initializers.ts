import * as SiteDefaults from "../defaults/site.default";
import * as I18nDefaults from "../defaults/i18n.default";

/**
 * 全局配置注册表
 */
export const GLOBAL_CONFIG_REGISTRY = {
  site: {
    defaults: SiteDefaults,
    userPath: "content/config/site.config.ts",
  },
  i18n: {
    defaults: I18nDefaults,
    userPath: "content/config/i18n.config.ts",
  },
} as const;

export type GlobalRegistry = typeof GLOBAL_CONFIG_REGISTRY;
