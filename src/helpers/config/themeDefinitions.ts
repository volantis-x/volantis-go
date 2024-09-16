import { validateTheme } from "@/helpers/lib/config";

// Layouts 布局层调用全局主题
// 使用方法：import { THEME } from "@THEME";
// Layouts layer calls the global theme
// Usage: import { THEME } from "@THEME";
export const THEME: string = validateTheme();

// 不支持 Fixed 头部导航的主题，将默认使用 Sticky
// Themes that do not support the Fixed header navigation will default to Sticky.
export const FIXED_TO_STICKY_THEMES = ["base"];
