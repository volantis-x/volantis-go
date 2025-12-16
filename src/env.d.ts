/// <reference path="../.astro/types.d.ts" />

import type { ThemeKey } from "./core/types/themes";

declare global {
  // 控制 Reloader 是否输出详细日志的全局开关
  var __VOLANTIS_RELOADER_VERBOSE__: boolean;

  // 声明 Vite 注入的全局常量
  const __VOLANTIS_THEME__: ThemeKey;

  // 版本号
  const __VOLANTIS_VERSION__: string;
}
