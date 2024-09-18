import type { TopNav } from "@/types/header";
import { WARNING_PREFIX } from "@/helpers/config/console";
import { validateTheme, validateTopNavLayout } from "@/lib/config";
import {
  FIXED_TO_STICKY_THEMES,
  SINGLE_COLUMN_UNSUPPORTED_THEMES,
} from "@/helpers/config/themeDefinitions";

/**
 * @en Normalize user input contentLayout value to "one" "two" "three".
 * @zh 将用户输入的 contentLayout 值标准化为 "one" "two" "three".
 *
 * @param layout - @en User input contentLayout value.
 *                 @zh 用户输入的 contentLayout 值.
 * @returns @en Normalized contentLayout value.
 *          @zh 标准化的 contentLayout 值.
 */
export function normalizeContentLayout(
  layout: TopNav["contentLayout"],
): "one" | "two" | "three" {
  const currentTheme = validateTheme();

  return layout === "one" &&
    SINGLE_COLUMN_UNSUPPORTED_THEMES.includes(currentTheme)
    ? (console.warn(
        `${WARNING_PREFIX} "header.config.ts" >> "TOP_NAV" >> "contentLayout" 配置项无效："${layout}"，将使用默认值 "twoColumns" \r\n` +
          `${WARNING_PREFIX} "contentLayout" in "TOP_NAV" (header.config.ts) is invalid: "${layout}". Defaulting to "twoColumns".`,
      ),
      "two")
    : layout;
}

/**
 * @en Normalizes the user input behavior value based on the current theme.
 * @zh 根据当前主题标准化用户输入的 behavior 值。
 *
 * @param layout - @en User input behavior value.
 *                 @zh 用户输入的 behavior 值。
 * @param theme - @en The current theme being used.
 *               @zh 当前使用的主题。
 * @returns @en Normalized behavior value.
 *          @zh 标准化的 behavior 值。
 */
export function normalizeBehavior(
  behavior: TopNav["behavior"],
): "fixed" | "static" | "sticky" {
  const currentTheme = validateTheme();

  return behavior === "fixed" && FIXED_TO_STICKY_THEMES.includes(currentTheme)
    ? (console.warn(
        `${WARNING_PREFIX} 当前主题 "${currentTheme}" 不支持 "header.config.ts >> TOP_NAV >> behavior >> fixed" 行为，将使用 "sticky" 行为代替。\r\n` +
          `${WARNING_PREFIX} The current theme "${currentTheme}" does not support "header.config.ts >> TOP_NAV >> behavior >> fixed" behavior. Using "sticky" behavior instead.`,
      ),
      "sticky")
    : behavior;
}
