import { UserTheme } from "@/content/site.config";
import { SUPPORTED_THEMES, type SupportedTheme } from "@/types/config";
import { WARNING_PREFIX } from "@/helpers/config/console";
import { TOP_NAV } from "@/content/header.config";
import {
  SUPPORTED_CONTENT_LAYOUTS,
  type SupportedContentLayouts,
} from "@/types/header";

/**
 * @en Validate the user-set theme and return a valid theme.
 * @zh 验证用户设置的主题并返回一个有效的主题。
 *
 * @returns {SupportedTheme} - @en A valid theme.
 *                             @zh 一个有效的主题。
 */
export const validateTheme = (): SupportedTheme => {
  if (!SUPPORTED_THEMES.includes(UserTheme as SupportedTheme)) {
    console.warn(
      `${WARNING_PREFIX} "site.config.ts" 的 "UserTheme" 配置项无效："${UserTheme}"，将使用默认值 "base" \r\n` +
        `${WARNING_PREFIX} Invalid "UserTheme" configuration value within "site.config.ts": "${UserTheme}". Using default value "base"`,
    );
    return "base";
  }

  return UserTheme as SupportedTheme;
};
