export type LocaleCode = string; // e.g. "zh-CN", "en"
export type TextDirection = "ltr" | "rtl";
export type TranslationData = {
  [key: string]: string | TranslationData;
};

export interface LocaleConfig {
  code: LocaleCode; // 标准代码: "zh-CN"
  path: string; // URL 前缀: "zh" (或者 "cn", "en")
  label: string; // 显示名称: "简体中文"
  dateFormat?: string; // 日期格式
}

export interface I18nConfig {
  /**
   * 全局开关：是否启用多语言
   * False: 单语言模式，忽略所有语言子目录逻辑，仅使用 DEFAULT_LOCALE
   * True: 多语言模式，解析子目录
   */
  ENABLE: boolean;

  /**
   * 默认语言 code
   */
  DEFAULT_LOCALE: LocaleCode;

  /**
   * 是否在 URL 中显示默认语言的前缀
   * true: /zh-cn/blog/post-1 (即使 zh-CN 是默认)
   * false: /blog/post-1
   */
  SHOW_DEFAULT_LANG: boolean;

  /**
   * 默认文本方向 (通常是 ltr)
   */
  DEFAULT_DIR: TextDirection;

  /**
   * 语言列表
   */
  LOCALES: Record<LocaleCode, LocaleConfig>;

  /**
   * 翻译字典 (UI)
   * { "zh-CN": { "category": "分类", ... } }
   */
  TRANSLATIONS?: Record<LocaleCode, TranslationData>;

  /**
   * x-default 回退策略
   * true: 如果存在 en-US，则 x-default 指向 en-US (推荐，国际化标准)
   * false: x-default 始终指向网站的 DEFAULT_LOCALE
   */
  FALLBACK_TO_EN: boolean;
}
