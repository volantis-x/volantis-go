import type { I18nConfig } from "@/core/types/i18n";
// import zh_CN from "../i18n/locales/zh_CN";
// import en_US from "../i18n/locales/en_US";

// export const TRANSLATIONS: Record<string, Record<string, string>> = {
//   zh_CN,
//   en_US,
// };

export const I18N: I18nConfig = {
  ENABLE: true, // 默认关闭，即单语言
  DEFAULT_LOCALE: "zh-CN",
  // 全站文本内容书写方向:
  // ltr = 从左到右，默认值，用于从左向右书写的语言（比如英语、中文等）
  // rtl = 从右到左，用于从右向左书写的语言（比如阿拉伯语）
  // The writing direction of the text content of the whole site:
  // ltr = left to right, default value, used for languages ​​written from left to right (such as English, Chinese, etc.)
  // rtl = right-to-left, for languages ​​written from right to left (such as Arabic)
  DEFAULT_DIR: "ltr",
  SHOW_DEFAULT_LANG: false,
  // 默认开启：优先使用英文作为全球回退
  FALLBACK_TO_EN: true,
  LOCALES: {
    "en-US": { code: "en-US", path: "en", label: "English" },
    "zh-CN": { code: "zh-CN", path: "zh-cn", label: "简体中文" },
  },
  // TRANSLATIONS,
};
