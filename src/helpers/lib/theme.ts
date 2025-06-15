import { UserTheme as rawUserTheme } from "@userConfig/site.config";
import { SUPPORTED_THEMES, type SupportedTheme } from "@/types/config";
import { Logger } from "@/helpers/lib/logger";

let validatedThemeName: SupportedTheme | null = null;
let validationWarningHasBeenShown = false;

function getValidatedThemeName(): SupportedTheme {
  if (validatedThemeName !== null) return validatedThemeName;
  const themeToValidate =
    typeof rawUserTheme === "string" ? rawUserTheme : "base";
  if (!SUPPORTED_THEMES.includes(themeToValidate as any)) {
    if (!validationWarningHasBeenShown) {
      Logger.warn(
        "CONFIG",
        "warn_invalid_user_theme",
        themeToValidate,
        SUPPORTED_THEMES.join(", "),
      );
      validationWarningHasBeenShown = true;
    }
    validatedThemeName = "base";
    return validatedThemeName;
  }
  validatedThemeName = themeToValidate as SupportedTheme;
  return validatedThemeName;
}

/**
 * @zh 当前激活的、经过验证的主题名称。
 * @en The currently active and validated theme name.
 * @type {SupportedTheme} - 这是一个精确的联合类型，例如 'base' | 'custom'
 */
// --- 关键：确保导出类型是 SupportedTheme ---
export const ACTIVE_THEME_NAME: SupportedTheme = getValidatedThemeName();
