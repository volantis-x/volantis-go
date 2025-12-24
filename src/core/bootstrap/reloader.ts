import { GLOBAL_CONFIG_REGISTRY } from "./config.initializers";
import { Logger } from "../logger";

// =======================================================
// 1. 扫描文件 (去掉了 components config 的扫描)
// =======================================================
const RAW_FILES = import.meta.glob(
  [
    "/content/config/*.ts", // site.config.ts
    "/content/config/locales/**/*.ts", // 用户配置 (zh-CN/components/marquee.ts)
    "/src/core/defaults/locales/**/*.ts", // 系统保底 (en-US/components/marquee.ts)
  ],
  { eager: true },
);

function getUserModule(path: string) {
  const key = path.startsWith("/") ? path : "/" + path;
  return RAW_FILES[key] || null;
}

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

// --- 缺失键检查函数 ---
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

// =======================================================
// 2. 处理全站逻辑 (Global Logic - site.config.ts)
// =======================================================
const globalStore: Record<string, any> = {};

for (const [key, config] of Object.entries(GLOBAL_CONFIG_REGISTRY)) {
  const { defaults, userPath } = config;
  const userModule: any = getUserModule(userPath);

  if (!userModule) {
    // 情况 A: 文件完全不存在
    if (isVerbose()) {
      Logger.warn("Bootstrap_initializer_config_not_found", userPath);
    }
    globalStore[key] = defaults;
  } else {
    // 情况 B: 文件存在，但可能缺项
    if (isVerbose()) {
      const missingFields = findMissingKeys(defaults, userModule);
      if (missingFields.length > 0) {
        const missingStr = missingFields.join(", ");
        const logMessage = `${userPath} -> [ ${missingStr} ]`;

        Logger.warn("Bootstrap_initializer_missing_config_keys", logMessage);
      }
    }

    globalStore[key] = deepMerge(defaults, userModule || {});
  }
}

// =======================================================
// 3. 处理 Locales (内容 + 组件逻辑)
// =======================================================
const rawLocaleStore: Record<string, any> = {};

// 3.1 路径解析器
function parseLocalePath(path: string) {
  // 匹配 "/locales/" 后面的部分
  // 捕获组 1: 语言代码 (如 zh-CN)
  // 捕获组 2: 剩余路径 (如 components/marquee.ts)
  const match = path.match(/\/locales\/([^\/]+)\/(.+)\.ts$/);

  if (!match) return null;

  const lang = match[1];
  const relativePath = match[2];
  const namespaces = relativePath.split("/");

  return { lang, namespaces };
}

// 3.2 挂载函数
function mountLocaleContent(lang: string, namespaces: string[], content: any) {
  if (!rawLocaleStore[lang]) rawLocaleStore[lang] = {};

  let current = rawLocaleStore[lang];
  for (let i = 0; i < namespaces.length; i++) {
    const key = namespaces[i];
    if (i === namespaces.length - 1) {
      current[key] = deepMerge(current[key] || {}, content);
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
}

// 3.3 扫描执行
Object.keys(RAW_FILES).forEach((path) => {
  if (!path.includes("/locales/")) return;

  const info = parseLocalePath(path);
  if (info) {
    const module: any = RAW_FILES[path];

    // DEBUG
    // if (
    //   import.meta.env.DEV &&
    //   path.includes("zh-CN") &&
    //   path.includes("marquee")
    // ) {
    //   Logger.say(`[Reloader] Found System Default: ${path}`);
    // }

    mountLocaleContent(info.lang, info.namespaces, module.default || {});
  }
});

// =======================================================
// 4. 执行继承合并 (Inheritance)
// =======================================================
const finalLocaleStore: Record<string, any> = {};
const SYSTEM_BASE_LANG = "en-US";

// A. 获取基准数据
const baseData = rawLocaleStore[SYSTEM_BASE_LANG] || {};

// B. 遍历所有收集到的语言
Object.keys(rawLocaleStore).forEach((lang) => {
  if (lang === SYSTEM_BASE_LANG) {
    finalLocaleStore[lang] = baseData;
  } else {
    const userLangData = rawLocaleStore[lang];

    // --- 检查该语言包相对于基准语言的缺失项 ---
    if (isVerbose()) {
      const missingKeys = findMissingKeys(baseData, userLangData);
      // 这里为了精简日志，只显示前几个
      if (missingKeys.length > 0) {
        // 只显示前 5 个，避免刷屏
        const displayKeys = missingKeys.slice(0, 5).join(", ");
        const moreCount = missingKeys.length - 5;
        const suffix = moreCount > 0 ? ` ...and ${moreCount} more` : "";

        Logger.warn(
          "Bootstrap_initializer_locale_fallback",
          `Locale [${lang}] missing keys, fallback to ${SYSTEM_BASE_LANG}: [ ${displayKeys}${suffix} ]`,
        );
      }
    }

    // 执行合并
    finalLocaleStore[lang] = deepMerge(baseData, userLangData);
  }
});

// C. 确保默认语言存在
if (!finalLocaleStore[SYSTEM_BASE_LANG]) {
  finalLocaleStore[SYSTEM_BASE_LANG] = baseData;
}

// === 调试输出 ===
// if (import.meta.env.DEV) {
//   Logger.say("---------------- RELOADER DEBUG ----------------");
//   Logger.say("Available Locales:", Object.keys(finalLocaleStore));
//   // 检查 zh-CN 下有没有 marquee
//   if (finalLocaleStore["zh-CN"]?.components?.marquee) {
//     Logger.say(
//       "zh-CN Marquee Primary:",
//       finalLocaleStore["zh-CN"].components.marquee.default.primaryContent,
//     );
//   } else {
//     Logger.say("zh-CN Marquee NOT FOUND in final store");
//   }
//   Logger.say("------------------------------------------------");
// }

// =======================================================
// 5. 导出
// =======================================================
export const LOADED_GLOBALS = globalStore;
export const LOADED_LOCALES = finalLocaleStore;
