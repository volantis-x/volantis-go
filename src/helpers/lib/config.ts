import { UserTheme as rawUserTheme } from '@userConfig/site.config';
import { SUPPORTED_THEMES, type SupportedTheme } from '@/types/config';
import { WARNING_PREFIX } from "@helpers/config/console";

export function getValidatedThemeName(): SupportedTheme {
  // 确保 rawUserTheme 是 string 类型，如果不是，给予默认值或进一步处理
  const themeToValidate = typeof rawUserTheme === 'string' ? rawUserTheme : 'base';

  if (!SUPPORTED_THEMES.includes(themeToValidate as SupportedTheme)) {
    console.warn(
      `${WARNING_PREFIX} 用户在 "content/config/site.config.ts" 中配置的 UserTheme ("${themeToValidate}") 无效或未在 SUPPORTED_THEMES 列表中，将使用默认主题 "base".\n` +
      `${WARNING_PREFIX} Invalid UserTheme ("${themeToValidate}") in "content/config/site.config.ts" or not in SUPPORTED_THEMES list. Using default theme "base".`
    );
    return "base";
  }
  return themeToValidate as SupportedTheme;
}
