import { UserTheme } from "@/content/site.config";
import { SUPPORTED_THEMES, type SupportedTheme } from "@/types/config";

// 验证用户设置的主题是否有效
// Validate the user-set theme
export const validateTheme = (): SupportedTheme => {
  // 使用类型断言，将 UserTheme 转换为 SupportedTheme 类型
  const theme = SUPPORTED_THEMES.includes(UserTheme as SupportedTheme)
    ? UserTheme
    : "base";
  return theme as SupportedTheme;
};
