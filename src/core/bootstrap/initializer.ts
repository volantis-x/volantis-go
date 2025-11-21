import { Logger } from "../logger";
import {
  _setGlobalConfig,
  _setProcessedConfig,
  _setNamedInstances,
} from "./store";
import { COMPONENT_REGISTRY } from "./component.initializers";
import { GLOBAL_CONFIG_REGISTRY } from "./config.initializers";

// =========================================================
// 使用 Vite 原生的 glob 功能加载所有配置文件
// =========================================================
// eager: true 表示直接同步加载模块内容，而不是返回一个 import() 函数
// 这里定义了两个扫描范围，覆盖所有可能的配置文件位置
const ALL_USER_CONFIGS = import.meta.glob(
  [
    "/content/config/**/*.ts", // 扫描全站配置
    "/content/components/**/*.ts", // 扫描组件配置
  ],
  { eager: true }
);

/**
 * 递归检查 source (用户配置) 相对于 target (默认配置) 缺失的属性
 * @param target 默认配置对象 (标准)
 * @param source 用户配置对象 (检查对象)
 * @param prefix 当前路径前缀 (用于日志显示，如 "CONFIG.DIR")
 * @returns 缺失的属性路径数组
 */
function findMissingKeys(
  target: any,
  source: any,
  prefix: string = ""
): string[] {
  const missing: string[] = [];

  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      const currentPath = prefix ? `${prefix}.${key}` : key;

      // 1. 检查是否完全缺失
      // 注意：我们允许 sourceValue 为 null 或 false，但不能是 undefined (即未定义)
      if (sourceValue === undefined) {
        missing.push(currentPath);
        continue;
      }

      // 2. 如果是对象，递归检查 (排除数组，数组通常直接替换)
      if (
        typeof targetValue === "object" &&
        targetValue !== null &&
        !Array.isArray(targetValue) &&
        typeof sourceValue === "object" &&
        sourceValue !== null
      ) {
        const nestedMissing = findMissingKeys(
          targetValue,
          sourceValue,
          currentPath
        );
        missing.push(...nestedMissing);
      }
    }
  }
  return missing;
}

// --- 工具：深度合并 ---
function deepMerge(target: any, source: any): any {
  if (
    typeof target !== "object" ||
    target === null ||
    typeof source !== "object" ||
    source === null
  ) {
    return source !== undefined ? source : target;
  }
  const output = Array.isArray(target) ? [...target] : { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

// --- 工具：安全查表 ---
// 现在不需要真正的 import 了，因为 glob 已经把模块加载到内存里了
// 我们只需要根据路径字符串去查找
async function safeImport<T = any>(relativePath: string): Promise<T | null> {
  // 标准化键名：import.meta.glob 的 key 通常以 / 开头 (相对于项目根目录)
  // 比如 "/content/config/site.config.ts"

  // 确保路径以 / 开头
  const lookupKey = relativePath.startsWith("/")
    ? relativePath
    : "/" + relativePath;

  const module = ALL_USER_CONFIGS[lookupKey];

  if (module) {
    return module as T;
  }

  // 调试用：如果一直找不到，可以打印一下 ALL_USER_CONFIGS 的所有 key 看看
  // console.log('Available Configs:', Object.keys(ALL_USER_CONFIGS));

  return null;
}

// ==========================================
// 1. 初始化全站配置
// ==========================================
async function initializeGlobalConfigs() {
  for (const item of GLOBAL_CONFIG_REGISTRY) {
    const { key, userPath, defaults } = item;
    const userModule = await safeImport(userPath);

    if (!userModule) {
      // 整个文件都丢了
      Logger.warn("Bootstrap_initializer_config_not_found", userPath);
      _setGlobalConfig(key, defaults);
    } else {
      // 文件存在，检查里面的字段有没有漏
      // userModule 是一个包含 export 的对象，defaults 也是
      const missingFields = findMissingKeys(defaults, userModule);

      if (missingFields.length > 0) {
        // 将所有缺失字段用逗号连接，或者循环打印
        // 假设 Logger 参数是: (MessageKey, VariableString)
        // 拼接格式示例: "content/config/site.config.ts :: [ SITE, CONFIG.DIR ]"

        const missingStr = missingFields.join(", ");
        const logMessage = `" ${userPath} -> [ ${missingStr} ] "`;

        Logger.warn("Bootstrap_initializer_missing_config_keys", logMessage);
      }

      const merged = deepMerge(defaults, userModule);
      _setGlobalConfig(key, merged);
    }
  }
}

// ==========================================
// 2. 初始化组件配置
// ==========================================
async function initializeComponentConfigs() {
  for (const item of COMPONENT_REGISTRY) {
    const { key, defaultProps, userPath } = item;
    const userModule = await safeImport(userPath);

    let userBaseConfig = {};
    if (userModule) {
      userBaseConfig = userModule.default || userModule.config || {};
      const missingFields = findMissingKeys(defaultProps, userBaseConfig);

      if (missingFields.length > 0) {
        const missingStr = missingFields.join(", ");
        const logMessage = `" ${userPath} -> [ ${missingStr} ] "`;

        // 缺失值提示
        Logger.info(
          "Bootstrap_initializer_missing_component_config_keys",
          logMessage
        );
      }
    }

    const finalGlobalConfig = deepMerge(defaultProps, userBaseConfig);
    _setProcessedConfig(key, finalGlobalConfig);

    // 4. 提取用户的命名实例 (如果存在)
    //    约定：export const instances = { ... } 或者 export const marqueeInstances = { ... }
    if (userModule) {
      const rawInstances =
        userModule.instances || userModule[`${key}Instances`];

      if (rawInstances && typeof rawInstances === "object") {
        const processedInstances: Record<string, any> = {};
        for (const id in rawInstances) {
          if (Object.prototype.hasOwnProperty.call(rawInstances, id)) {
            // 实例配置 = 全局最终配置 + 实例差异
            processedInstances[id] = deepMerge(
              finalGlobalConfig,
              rawInstances[id]
            );
          }
        }
        _setNamedInstances(key, processedInstances);
      }
    }
  }
}

// ==========================================
// 主入口
// ==========================================
let initPromise: Promise<void> | null = null;

export function runInitializers(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      Logger.info("Bootstrap_initializer_running");
      await initializeGlobalConfigs();
      await initializeComponentConfigs();
      Logger.success("Bootstrap_initializer_successfully");
    } catch (err: any) {
      Logger.error("Bootstrap_initializer_error", err.message);
      console.error(err);
    }
  })();
  return initPromise;
}
