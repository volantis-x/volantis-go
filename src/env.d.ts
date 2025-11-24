/// <reference path="../.astro/types.d.ts" />

// 引入你的主题类型定义
import type { SupportedTheme } from "./types/config";

declare global {
  // 声明 Vite 注入的全局常量
  const __VOLANTIS_THEME__: SupportedTheme;
}
