import { UserTheme as rawUserTheme } from "../../../content/config/site.config";
import { SUPPORTED_THEMES, type SupportedTheme } from "../../types/config";
import { Logger } from "../../helpers/lib/logger";

let validatedThemeName: SupportedTheme | null = null;
let validationWarningHasBeenShown = false;

/**
 * @zh 验证用户主题并返回一个有效的、经过缓存的主题名称。只在首次调用时执行验证和警告。
 * @en Validates the user theme and returns a valid, cached theme name. Validation and warning only occur on the first call.
 * @returns {SupportedTheme}
 */
function getValidatedThemeName(): SupportedTheme {
  if (validatedThemeName !== null) {
    return validatedThemeName;
  }

  const defaultTheme: SupportedTheme = "base";

  const userConfiguredTheme =
    typeof rawUserTheme === "string" && rawUserTheme.trim() !== ""
      ? rawUserTheme.trim()
      : defaultTheme;

  if (!(SUPPORTED_THEMES as readonly string[]).includes(userConfiguredTheme)) {
    if (!validationWarningHasBeenShown) {
      Logger.warn(
        "CONFIG",
        "warn_invalid_user_theme",
        userConfiguredTheme,
        SUPPORTED_THEMES.join(", "),
        defaultTheme,
      );
      validationWarningHasBeenShown = true;
    }
    validatedThemeName = defaultTheme;
    return validatedThemeName;
  }

  validatedThemeName = userConfiguredTheme as SupportedTheme;
  return validatedThemeName;
}

/**
 * @zh 当前激活的、经过验证的主题名称。
 * @en The currently active and validated theme name.
 * @type {SupportedTheme} - 这是一个精确的联合类型，例如 'base' | 'custom'
 */
// --- 关键：确保导出类型是 SupportedTheme ---
export const ACTIVE_THEME_NAME: SupportedTheme = getValidatedThemeName();
