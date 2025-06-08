import { UserTheme as rawUserTheme } from '@userConfig/site.config';
import { SUPPORTED_THEMES, type SupportedTheme } from '@/types/config';
import { WARNING_PREFIX } from '@/helpers/config/console';

let validatedThemeName: SupportedTheme | null = null;
let validationWarningHasBeenShown = false;

function getValidatedThemeName(): SupportedTheme {
  if (validatedThemeName !== null) return validatedThemeName;
  const themeToValidate = typeof rawUserTheme === 'string' ? rawUserTheme : 'base';
  if (!SUPPORTED_THEMES.includes(themeToValidate as any)) {
    if (!validationWarningHasBeenShown) {
      console.warn(
      `${WARNING_PREFIX} 用户在 "content/config/site.config.ts" 中配置的 UserTheme ("${themeToValidate}") 无效或未在 SUPPORTED_THEMES 列表中，将使用默认主题 "base".\n` +
      `${WARNING_PREFIX} Invalid UserTheme ("${themeToValidate}") in "content/config/site.config.ts" or not in SUPPORTED_THEMES list. Using default theme "base".`
    );
      validationWarningHasBeenShown = true;
    }
    validatedThemeName = "base";
    return validatedThemeName;
  }
  validatedThemeName = themeToValidate as SupportedTheme;
  return validatedThemeName;
}

export const ACTIVE_THEME_NAME: SupportedTheme = getValidatedThemeName();
