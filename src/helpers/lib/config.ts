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

/**
 * @en Validates the user-configured `contentLayout` for the top navigation and returns a valid layout.
 * @zh 验证用户配置的顶部导航栏内容布局，并返回有效的布局。
 *
 * @returns {SupportedContentLayouts} - @en A valid top navigation content layout.
 *                                      @zh 一个有效的顶部导航栏内容布局。
 */
export const validateTopNavLayout = (): SupportedContentLayouts => {
  if (
    !SUPPORTED_CONTENT_LAYOUTS.includes(
      TOP_NAV.contentLayout as SupportedContentLayouts,
    )
  ) {
    console.warn(
      `${WARNING_PREFIX} "header.config.ts" >> "TOP_NAV" >> "contentLayout" 配置项无效："${TOP_NAV.contentLayout}"，将使用默认值 "two" \r\n` +
        `${WARNING_PREFIX} Invalid "contentLayout" configuration value within "header.config.ts" >> "TOP_NAV": "${TOP_NAV.contentLayout}". Using default value "two"`,
    );
    return "two";
  }

  return TOP_NAV.contentLayout as SupportedContentLayouts;
};
