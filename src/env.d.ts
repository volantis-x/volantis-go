/// <reference path="../.astro/types.d.ts" />

import type { ThemeKey } from "./core/types/themes";

declare global {
  // // Vite 注入的配置数据
  // const __VOLANTIS_GLOBAL_DATA__: any;
  // const __VOLANTIS_COMPONENT_DATA__: any;
  // const __VOLANTIS_INSTANCES_DATA__: any;

  // 声明 Vite 注入的全局常量
  const __VOLANTIS_THEME__: ThemeKey;
}
