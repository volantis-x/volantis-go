import { UserTheme } from "./site.config";

export type Config = {
  FAVICON: string;
  DEFAULT_LOCALE: string;
  DIR: string;
  DEFAULT_TITLE: string;
  DEFAULT_DESCRIPTION: string;
  DEFAULT_AUTHOR: string;
  ADD_TITLE: boolean;
  DELIMITER: boolean;
  VIEW_TRANSITIONS: boolean;
  USE_SMALLER_FONT: boolean;
};

// 注意：此处的主题验证逻辑仅用于本项目，请勿在其他项目中直接在类型定义文件中执行此类操作。
// Note: The theme validation logic here is specific to this project.
// Please avoid performing such operations directly within type definition files in other projects.
// 定义所有支持的主题
// Define all supported themes
const SUPPORTED_THEMES = ["base"] as const;
export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];
// 验证用户设置的主题是否有效
// Validate the user-set theme
export const validatedTheme = (): SupportedTheme => {
  // 使用类型断言，将 UserTheme 转换为 SupportedTheme 类型
  const theme = SUPPORTED_THEMES.includes(UserTheme as SupportedTheme)
    ? UserTheme
    : "base";
  return theme as SupportedTheme;
};

export type MarqueeTop = {
  ENABLE: boolean;
  DIRECTION: string;
  DEFAULT_PRIMARY_CONTENT: string;
  DEFAULT_SECONDARY_CONTENT: string;
};

export type Metadata = {
  DEFAULT_TITLE: string;
  DEFAULT_DESCRIPTION: string;
};

export type I18n = {
  USE_I18N: boolean;
};
