import { getCollection } from "astro:content";
import { getGlobalConfig } from "../bootstrap/store";
import type { LocaleConfig } from "../types/i18n";
import { SUPPORTED_COLLECTIONS } from "../types/collections";
import fs from "node:fs";
import path from "node:path";

// 定义统一的内容对象结构
export interface StandardContentEntry {
  id: string;
  slug: string; // 原始 slug
  cleanSlug: string; // 用于 SEO 匹配 (不含语言，不含集合名)
  permalink: string; // 最终的 URL (含语言，含集合名)
  lang: string; // 语言代码
  data: any; // Frontmatter 数据
  collection: string; // 集合名
  original: any; // 原始 Astro Entry
  shouldRender?: boolean; // 内部使用的标记
}

export async function getI18nCollection(
  collectionName: string
): Promise<StandardContentEntry[]> {
  let rawItems: any[] = [];
  try {
    rawItems = await getCollection(collectionName as any);
  } catch (e) {
    return [];
  }

  if (!rawItems || rawItems.length === 0) return [];

  // 1. 获取配置
  const i18nCfg = getGlobalConfig("i18n")!.I18N;
  const enableI18n = i18nCfg.ENABLE;
  const defaultLang = i18nCfg.DEFAULT_LOCALE;
  const showDefaultLang = i18nCfg.SHOW_DEFAULT_LANG;
  const localesMap = i18nCfg.LOCALES;
  const localeValues = Object.values(localesMap) as LocaleConfig[];

  // 2. 构建目录查找表 (Code/Path -> Standard Code)
  const dirToLangCode: Record<string, string> = {};
  localeValues.forEach((loc) => {
    // 标准 & 小写
    dirToLangCode[loc.code] = loc.code;
    dirToLangCode[loc.code.toLowerCase()] = loc.code;
    // Path & 小写
    dirToLangCode[loc.path] = loc.code;
    dirToLangCode[loc.path.toLowerCase()] = loc.code;

    // 下划线兼容 (zh_CN, zh_cn)
    if (loc.code.includes("-")) {
      const underscoreCode = loc.code.replace(/-/g, "_");
      dirToLangCode[underscoreCode] = loc.code;
      dirToLangCode[underscoreCode.toLowerCase()] = loc.code;
    }
  });

  // 3. 处理每篇文章
  const processedItems = rawItems
    .filter((item: any) => item && (item.slug || item.id))
    .map((item: any) => {
      const rawSlug = item.slug || item.id;
      const slugParts = rawSlug.split("/");

      const firstPartOriginal = slugParts[0];
      const firstPartLower = firstPartOriginal.toLowerCase();

      // 尝试识别目录是否为语言代码
      const detectedLang =
        dirToLangCode[firstPartOriginal] || dirToLangCode[firstPartLower];

      let lang = defaultLang;
      let cleanSlug = rawSlug;
      let shouldRender = true;

      // ============================================================
      // A. 语言判定与过滤逻辑 (Controller Logic)
      // ============================================================
      if (detectedLang) {
        // --- 这是一个语言文件夹 (e.g. blog/zh-CN/...) ---

        if (!enableI18n) {
          // [单语言模式]
          // 只有当文件夹语言 == 默认语言时才渲染
          if (detectedLang === defaultLang) {
            lang = defaultLang;
            cleanSlug = slugParts.slice(1).join("/");
          } else {
            shouldRender = false; // 隐藏非默认语言内容
          }
        } else {
          // [多语言模式]
          lang = detectedLang;
          cleanSlug = slugParts.slice(1).join("/");
        }
      } else {
        // --- 这是一个普通文件夹或根文件 (e.g. blog/2025/...) ---
        // 默认为默认语言
        lang = defaultLang;
        cleanSlug = rawSlug;
      }

      // 兜底空 slug
      if (cleanSlug === "") cleanSlug = undefined as any;

      // ============================================================
      // B. 最终 URL 生成 (View Logic -> Moved to Data Layer)
      // ============================================================

      let urlPrefix = "";

      // 获取当前语言的 path 配置 (例如 zh-cn)
      // 如果 map 里没找到 (不太可能)，就用 lang code 本身
      const langPathConfig = localesMap[lang]?.path || lang.toLowerCase();

      if (enableI18n) {
        // [多语言模式]
        if (lang === defaultLang) {
          // 默认语言：看开关决定是否加前缀
          urlPrefix = showDefaultLang ? `/${langPathConfig}` : "";
        } else {
          // 其他语言：必须加前缀
          urlPrefix = `/${langPathConfig}`;
        }
      } else {
        // [单语言模式]
        // 看开关决定是否加前缀 (比如单语言英文站也想要 /en/ 开头)
        urlPrefix = showDefaultLang ? `/${langPathConfig}` : "";
      }

      // 拼接最终链接: /zh-cn/blog/post-1
      // 注意处理双斜杠
      const collectionPrefix = collectionName ? `/${collectionName}` : "";
      const slugPart = cleanSlug ? `/${cleanSlug}` : "";

      // 拼接基础路径 (并处理多余的双斜杠)
      let permalink = `${urlPrefix}${collectionPrefix}${slugPart}`.replace(
        /\/+/g,
        "/"
      );

      // 强制规范化：除了根路径 "/" 以外，必须以 "/" 结尾
      if (permalink !== "/" && !permalink.endsWith("/")) {
        permalink = `${permalink}/`;
      }
      return {
        id: item.id,
        slug: rawSlug,
        cleanSlug,
        permalink,
        lang,
        data: item.data,
        collection: collectionName,
        original: item,
        shouldRender,
      };
    });

  return processedItems.filter((item) => item.shouldRender);
}

/**
 * 根据 cleanSlug 查找同一内容的其他语言版本 (用于 SEO alternate)
 */
export function findAlternates(
  allPosts: StandardContentEntry[],
  currentPost: StandardContentEntry
) {
  return allPosts.filter(
    (p) => p.cleanSlug === currentPost.cleanSlug && p.lang !== currentPost.lang
  );
}

// 1. 新增：获取实际存在内容的集合列表
// 这样我们在循环时，直接跳过那些不存在的目录
export function getAvailableCollections(): string[] {
  const available: string[] = [];

  // 注意：SUPPORTED_COLLECTIONS 应该是一个数组 ['blog', 'docs', ...]
  for (const name of SUPPORTED_COLLECTIONS) {
    const dirPath = path.join(process.cwd(), "content", name);
    // 检查目录是否存在且非空
    if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length > 0) {
      available.push(name);
    }
  }
  return available;
}

// 2. 修改 getAllCollectionsInLang
export async function getAllCollectionsInLang(lang: string) {
  const result: Record<string, any[]> = {};

  // 动态获取存在的集合，而不是死循环 SUPPORTED_COLLECTIONS
  const availableCols = getAvailableCollections();

  for (const name of availableCols) {
    // 现在调用 getI18nCollection 是安全的，因为目录一定存在
    const items = await getI18nCollection(name);

    const filtered = items
      .filter((item) => item.lang === lang)
      .sort(
        (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0)
      );

    // 只有当有内容时才加入结果
    if (filtered.length > 0) {
      result[name] = filtered;
    }
  }

  return result;
}
