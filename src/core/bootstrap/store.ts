// src/core/bootstrap/store.ts
import { LOADED_LOCALES, LOADED_GLOBALS } from "./reloader";

// 自动推断全局配置
export function getGlobalConfig<K extends keyof typeof LOADED_GLOBALS>(key: K) {
  return LOADED_GLOBALS[key];
}

/**
 * 核心：获取组件配置 (包含逻辑和内容)
 *
 * @param componentName 组件名 (e.g. "marquee")
 * @param lang 当前语言
 * @param instanceId (可选) 实例ID
 */
export function getComponentConfig<T = any>(
  componentName: string,
  lang: string,
  instanceId?: string,
): T {
  // 1. 获取语言包 (如果找不到该语言，回退到系统默认语言 en-US 或 site.config 定义的默认语言)
  // 这里简化为回退到 en-US
  let localeData = LOADED_LOCALES[lang];

  if (!localeData) {
    // 回退机制：如果找不到当前语言，强制回退到 'en-US' (这是系统保底语言)
    localeData = LOADED_LOCALES["en-US"];
  }

  if (
    !localeData ||
    !localeData.components ||
    !localeData.components[componentName]
  ) {
    // 极端情况：系统保底文件都丢了
    return {} as T;
  }

  const compData = localeData.components[componentName];

  // 2. 获取基础配置 (default)
  const baseConfig = compData.default || {};

  // 3. 如果有 instanceId，合并实例配置
  if (instanceId && compData[instanceId]) {
    // 实例配置覆盖基础配置
    // e.g. homeTop { direction: 'right' } 覆盖 default { direction: 'left' }
    // 同时继承 default 的 { scrollDuration: '60s' }
    return { ...baseConfig, ...compData[instanceId] };
    // 注意：如果需要深合并，这里要用 deepMerge。但在运行时做深合并有性能损耗，浅合并通常够用。
  }

  return baseConfig as T;
}
