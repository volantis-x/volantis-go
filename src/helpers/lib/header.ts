import type { TopNav } from "@/types/header";
import { WARNING } from "@/helpers/config/console";
import { STICKY_TO_FIXED_THEMES } from "@/helpers/config/themeDefinitions";
import { validateTheme } from "@/lib/config";

/**
 * @en Normalize user input contentLayout value to "twoColumns" or "threeColumns".
 * @zh 将用户输入的 contentLayout 值标准化为 "twoColumns" 或 "threeColumns".
 *
 * @param layout - @en User input contentLayout value.
 *                 @zh 用户输入的 contentLayout 值.
 * @returns @en Normalized contentLayout value.
 *          @zh 标准化的 contentLayout 值.
 */
export function normalizeContentLayout(
  layout: TopNav["contentLayout"],
): "twoColumns" | "threeColumns" {
  switch (layout) {
    case "two":
    case "twoParts":
    case "twoColumns":
    case "double":
      return "twoColumns";
    case "three":
    case "threeParts":
    case "threeColumns":
    case "triple":
      return "threeColumns";
    default:
      console.warn(
        `${WARNING} "header.config.ts" >> "TOP_NAV" >> "contentLayout" 配置项无效："${layout}"，将使用默认值 "twoColumns" \r\n` +
          `${WARNING} "contentLayout" in "TOP_NAV" (header.config.ts) is invalid: "${layout}". Defaulting to "twoColumns".`,
      );
      return "twoColumns";
  }
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
): "static" | "fixed" | "sticky" {
  const currentTheme = validateTheme();

  return behavior === "sticky" && STICKY_TO_FIXED_THEMES.includes(currentTheme)
    ? (console.warn(
        `${WARNING} 当前主题 "${currentTheme}" 不支持 "sticky" 行为，将使用 "fixed" 行为代替。\r\n` +
          `${WARNING} The current theme "${currentTheme}" does not support "sticky" behavior. Using "fixed" behavior instead.`,
      ),
      "fixed")
    : behavior;
}
