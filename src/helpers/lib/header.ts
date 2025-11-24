import type { TopNav } from "@/types/header";
import {
  FIXED_TO_STICKY_THEMES,
  SINGLE_COLUMN_UNSUPPORTED_THEMES,
} from "@/config/themes.config";
import { Logger } from "@/helpers/lib/logger";

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
  const currentTheme = __VOLANTIS_THEME__;

  return layout === "one" &&
    SINGLE_COLUMN_UNSUPPORTED_THEMES.includes(currentTheme)
    ? (Logger.warn("COMPONENT", "warn_topnav_single_column_unsupported"), "two")
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
  const currentTheme = __VOLANTIS_THEME__;

  return behavior === "fixed" && FIXED_TO_STICKY_THEMES.includes(currentTheme)
    ? (Logger.warn("COMPONENT", "warn_topnav_fixed_behavior_unsupported"),
      "sticky")
    : behavior;
}
