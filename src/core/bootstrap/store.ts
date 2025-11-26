import {
  LOADED_GLOBALS,
  LOADED_COMPONENTS,
  LOADED_INSTANCES,
} from "./reloader";

// 1. 引入注册表的类型 (不需要引入具体的值，只要类型)
import type { ComponentRegistry } from "./component.initializers";
import type { GlobalRegistry } from "./config.initializers";

// ============================================================
// 2. 自动生成类型映射 (Auto Type Inference)
//    这里利用 TS 的条件类型，自动从 defaults 中提取类型
// ============================================================

// 自动推断组件类型：提取 COMPONENTS[Key]['defaults'] 的类型
type AutoComponentMap = {
  [K in keyof ComponentRegistry]: ComponentRegistry[K]["defaults"];
};

// 自动推断全局配置类型
type AutoGlobalMap = {
  [K in keyof GlobalRegistry]: GlobalRegistry[K]["defaults"];
};

// ============================================================
// 3. Getter 函数
// ============================================================

/**
 * 获取全站配置
 * 泛型 K 会自动提示 "site" | "i18n"
 * 返回值自动推断为 SiteDefaults 的类型
 */
export function getGlobalConfig<K extends keyof AutoGlobalMap>(
  key: K,
): Readonly<AutoGlobalMap[K]> | undefined {
  return LOADED_GLOBALS[key] as Readonly<AutoGlobalMap[K]>;
}

/**
 * 获取组件配置
 * 泛型 K 会自动提示 "marquee"
 * 返回值自动推断为 MarqueeProps
 */
export function getProcessedConfig<K extends keyof AutoComponentMap>(
  key: K,
): Readonly<AutoComponentMap[K]> | undefined {
  return LOADED_COMPONENTS[key] as Readonly<AutoComponentMap[K]>;
}

/**
 * 获取组件实例
 */
export function getNamedInstanceConfig<K extends keyof AutoComponentMap>(
  componentKey: K,
  instanceId: string,
): Readonly<AutoComponentMap[K]> | undefined {
  const instances = LOADED_INSTANCES[componentKey];
  if (
    instances &&
    Object.prototype.hasOwnProperty.call(instances, instanceId)
  ) {
    return instances[instanceId] as Readonly<AutoComponentMap[K]>;
  }
  return undefined;
}
