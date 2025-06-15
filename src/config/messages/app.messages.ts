// import { ACTIVE_THEME_NAME } from '@lib/theme';

export const messages = {
  en: {
    app_version: (version: string) => `Volantis GO version: ${version}`,
    app_new_version_available: (newVersion: string) => `A new version is available: ${newVersion}. Please run 'git pull' to update.`,
    active_theme: (themeName: string) => `Active theme is set to "${themeName}".`,
  },
  cn: {
    app_version: (version: string) => `Volantis GO 版本: ${version}`,
    app_new_version_available: (newVersion: string) => `发现新版本: ${newVersion}。请在项目目录运行 'git pull' 进行更新。`,
    active_theme: (themeName: string) => `当前激活的主题是 "${themeName}"。`,
  },
};
