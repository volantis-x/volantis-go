import { COMPONENTS } from "./component.initializers";
import { GLOBALS } from "./config.initializers";
import { Logger } from "../logger";

// 1. 使用 Vite 的 import.meta.glob 动态抓取所有配置
const USER_CONFIGS = import.meta.glob(
  ["/content/config/**/*.ts", "/content/components/**/*.ts"],
  { eager: true },
);
// 获取当前是否允许 verbose 日志
function isVerbose() {
  return globalThis.__VOLANTIS_RELOADER_VERBOSE__ === true;
}

// --- 辅助工具：判断纯对象 ---
function isPlainObject(item: any): boolean {
  return (
    item && typeof item === "object" && !Array.isArray(item) && item !== null
  );
}

// --- 辅助工具：深度合并 ---
function deepMerge(target: any, source: any): any {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source !== undefined ? source : target;
  }
  const output = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = output[key];
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    }
  }
  return output;
}

// --- 新增：缺失键检查函数 ---
function findMissingKeys(
  target: any,
  source: any,
  prefix: string = "",
): string[] {
  const missing: string[] = [];
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      const currentPath = prefix ? `${prefix}.${key}` : key;

      // 允许 null 或 false，但不能是 undefined
      if (sourceValue === undefined) {
        missing.push(currentPath);
        continue;
      }

      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        const nestedMissing = findMissingKeys(
          targetValue,
          sourceValue,
          currentPath,
        );
        missing.push(...nestedMissing);
      }
    }
  }
  return missing;
}

// --- 辅助工具：获取模块 ---
function getUserModule(path: string) {
  const key1 = path.startsWith("/") ? path : "/" + path;
  const key2 = path.startsWith("/") ? path.slice(1) : path;
  return USER_CONFIGS[key1] || USER_CONFIGS[key2] || null;
}

// =======================================================
// 2. 处理全局配置 (Global Configs)
// =======================================================
const globalStore: Record<string, any> = {};

for (const [key, config] of Object.entries(GLOBALS)) {
  const { defaults, userPath } = config;
  const userModule: any = getUserModule(userPath);

  if (!userModule) {
    // --- 缺失文件警告 ---
    if (isVerbose()) {
      Logger.warn("Bootstrap_initializer_config_not_found", userPath);
    }
    // console.warn(`[Volantis] Config not found: ${userPath}, using defaults.`);
    globalStore[key] = defaults;
  } else {
    // --- 逻辑恢复：缺失属性检查 ---
    const missingFields = findMissingKeys(defaults, userModule);
    if (missingFields.length > 0 && isVerbose()) {
      const missingStr = missingFields.join(", ");
      const logMessage = `" ${userPath} -> [ ${missingStr} ] "`;

      Logger.warn("Bootstrap_initializer_missing_config_keys", logMessage);
      // console.warn(`[Volantis] Missing keys in global config: ${logMessage}`);
    }

    globalStore[key] = deepMerge(defaults, userModule);
  }
}

// =======================================================
// 3. 处理组件配置 (Component Configs)
// =======================================================
const componentStore: Record<string, any> = {};
const instanceStore: Record<string, any> = {};

for (const [key, config] of Object.entries(COMPONENTS)) {
  const { defaults, userPath } = config;

  const userModule: any = getUserModule(userPath);
  let userBaseConfig = {};

  if (userModule) {
    userBaseConfig = userModule.default || userModule.config || {};

    // --- 逻辑恢复：组件属性缺失检查 (Optional) ---
    // 组件通常是部分覆盖，所以用 Info 或 Debug 级别，或者只检查必要的
    const missingFields = findMissingKeys(defaults, userBaseConfig);
    if (missingFields.length > 0) {
      // 这里的判断标准看你需求，如果觉得组件部分配置很正常，可以注释掉
      // 或者只在开发模式下显示
      if (import.meta.env.DEV && isVerbose()) {
        const missingStr = missingFields.join(", ");
        const logMessage = `" ${userPath} -> [ ${missingStr} ] "`;

        Logger.info(
          "Bootstrap_initializer_missing_component_config_keys",
          logMessage,
        );
        // console.info(`[Volantis] Component partial override: ${userPath} -> Using defaults for: [${missingStr}]`);
      }
    }
  } else {
    // 如果组件配置文件完全不存在，这通常是正常的，但也可能你想提示
    // console.debug(`[Volantis] No user config for component: ${key}`);
  }

  // 合并基础配置
  const finalConfig = deepMerge(defaults, userBaseConfig);
  componentStore[key] = finalConfig;

  // 处理命名实例
  if (userModule) {
    const rawInstances = userModule.instances || userModule[`${key}Instances`];
    if (rawInstances) {
      const processed: Record<string, any> = {};
      for (const id in rawInstances) {
        processed[id] = deepMerge(finalConfig, rawInstances[id]);
      }
      instanceStore[key] = processed;
    }
  }
}

// if (import.meta.env.DEV) {
//   // 这里的日志会在每次 HMR 时出现，了解刷新
//   // console.log(`[Volantis] Configuration reloaded via HMR.`);
// }

export const LOADED_GLOBALS = globalStore;
export const LOADED_COMPONENTS = componentStore;
export const LOADED_INSTANCES = instanceStore;
