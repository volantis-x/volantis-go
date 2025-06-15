// import { ACTIVE_THEME_NAME } from '@lib/theme';

export const messages = {
  en: {
    warn_invalid_user_theme: (
      invalidTheme: string,
      supportedThemes: string,
    ) =>
      `The 'UserTheme' ("${invalidTheme}") configured in "content/config/site.config.ts" is invalid or not in the supported list (${supportedThemes}). The default theme "base" will be used instead.`,
  },
  cn: {
    warn_invalid_user_theme: (
      invalidTheme: string,
      supportedThemes: string,
    ) =>
      `在 "content/config/site.config.ts" 中配置的 'UserTheme' ("${invalidTheme}") 无效或不在支持列表 (${supportedThemes}) 中。将使用默认主题 "base"。`,
  },
};
