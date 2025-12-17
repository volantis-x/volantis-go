import { getGlobalConfig } from "../bootstrap/store";
import { LOADED_LOCALES } from "../bootstrap/reloader";
import type { LocaleCode, LocaleConfig } from "../types/i18n";

// --- 获取 I18n 配置 ---
export function getI18nConfig() {
  // 这里的 ! 断言是安全的，因为 reloader 保证了 defaults 存在
  return getGlobalConfig("i18n")!.I18N;
}

/**
 * 获取当前启用的所有语言列表
 */
export function getSupportedLocales(): LocaleConfig[] {
  const cfg = getI18nConfig();
  if (!cfg.ENABLE) {
    // 单语言模式：只返回默认语言
    const def = cfg.LOCALES[cfg.DEFAULT_LOCALE];
    return def ? [def] : [];
  }
  return Object.values(cfg.LOCALES);
}

/**
 * 获取默认语言配置
 */
export function getDefaultLocale(): LocaleConfig {
  const cfg = getI18nConfig();
  return cfg.LOCALES[cfg.DEFAULT_LOCALE];
}

/**
 * 从 URL 解析当前语言
 * @param url Astro.url 对象
 * @returns 语言代码 (例如 "zh-CN", "en-US")
 */
export function getCurrentLang(url: URL): string {
  const cfg = getI18nConfig();

  // 1. 如果没开启 i18n，直接返回默认语言
  if (!cfg.ENABLE) {
    return cfg.DEFAULT_LOCALE || "en-US";
  }

  // 2. 解析路径
  // 例如: /zh/blog/post-1 -> parts = ["", "zh", "blog", "post-1"]
  // parts[1] 就是第一段路径
  const parts = url.pathname.split("/");
  const firstPath = parts[1];

  // 3. 查找匹配的语言配置
  const locales = cfg.LOCALES || {};
  const localeValues = Object.values(locales) as LocaleConfig[];
  const foundLocale = localeValues.find((loc) => loc.path === firstPath);

  // 4. 如果找到了 (例如匹配到 "zh")，返回对应的 code ("zh-CN")
  if (foundLocale) {
    return foundLocale.code;
  }

  // 5. 如果没找到，返回默认语言
  return cfg.DEFAULT_LOCALE;
}

/**
 * 生成带语言前缀的路径
 * @param path 原始路径 (e.g. "blog/post-1")
 * @param lang 目标语言
 */
export function getLocalizedPath(path: string, lang: LocaleCode): string {
  const cfg = getI18nConfig();
  const locale = cfg.LOCALES[lang];

  // 容错修复：确保 path 是字符串，如果是 undefined/null 则视为空字符串
  const safePath = path || "";

  // 移除开头的 /
  const cleanPath = safePath.startsWith("/") ? safePath.slice(1) : safePath;

  let result = "";

  // 策略：如果 i18n 关闭，或者目标语言是默认语言 -> 不带前缀
  if (!cfg.ENABLE || lang === cfg.DEFAULT_LOCALE) {
    // 🟢 修复：赋值给 result，而不是直接 return
    result = `/${cleanPath}`;
  } else {
    // 其他语言 -> 带前缀
    result = locale ? `/${locale.path}/${cleanPath}` : `/${cleanPath}`;
  }

  // 强制尾部斜杠逻辑 (Force Trailing Slash)
  // 逻辑：
  // a. 不是根路径 "/"
  // b. 还没有以 "/" 结尾
  // c. 不是文件 (没有扩展名)
  if (
    result !== "/" &&
    !result.endsWith("/") &&
    !result.split("/").pop()?.includes(".")
  ) {
    result += "/";
  }

  return result;
}

/**
 * 核心翻译函数 (支持嵌套查找)
 * @param key 键路径，例如 "site.title" 或 "components.marquee.primary"
 * @param lang 目标语言代码
 * @param args 动态参数
 */
export function __t(key: string, lang: string, ...args: any[]): string {
  const cfg = getI18nConfig();
  const defaultLang = cfg.DEFAULT_LOCALE || "en-US";

  // 1. 获取目标语言的所有内容对象
  // 如果找不到该语言的数据，回退到默认语言
  let localeData = LOADED_LOCALES[lang];
  if (!localeData) {
    localeData = LOADED_LOCALES[defaultLang];
  }

  // 2. 深度查找 Key (e.g. "site.title" -> localeData['site']['title'])
  const keys = key.split(".");
  let value: any = localeData;

  for (const k of keys) {
    if (value && typeof value === "object") {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  // 3. 如果没找到值
  if (value === undefined) {
    // 这里如果还没找到，说明默认语言里也没有这个 Key
    // 直接返回 Key 本身方便调试
    return key;
  }

  // 4. 参数替换
  if (typeof value === "string") {
    return value.replace(/\{(\d+)\}/g, (match, number) => {
      return typeof args[number] !== "undefined" ? args[number] : match;
    });
  }

  return String(value);
}

/**
 * 获取当前语言的文本方向 (ltr 或 rtl)
 * @param lang 语言代码 (e.g. "zh-CN", "ar-EG")
 */
export function getLanguageDirection(lang: string): "ltr" | "rtl" {
  const cfg = getI18nConfig();

  // 1. 尝试获取该语言的特定配置
  const localeConfig = cfg.LOCALES[lang];
  if (localeConfig && localeConfig.dir) {
    return localeConfig.dir;
  }

  // 2. 如果没找到或没配置，返回全局默认
  return cfg.DEFAULT_DIR || "ltr";
}
