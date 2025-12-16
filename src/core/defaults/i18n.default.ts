import type { I18nConfig } from "../types/i18n";
import zh_CN from "./locales/zh-CN/ui";
import en_US from "./locales/en-US/ui";

export const I18N: I18nConfig = {
  ENABLE: false, // 默认关闭，即单语言
  DEFAULT_LOCALE: "en-US", // 默认英文
  DEFAULT_DIR: "ltr", // 全局默认文本方向
  SHOW_DEFAULT_LANG: false, // 不显示默认语言的 path 路径
  // 默认开启：优先使用英文作为全球回退
  FALLBACK_TO_EN: true,
  LOCALES: {
    "zh-CN": {
      code: "zh-CN",
      path: "zh-cn",
      label: "简体中文",
      // dir: "ltr" // 可选，不写默认用 DEFAULT_DIR
    },
    "en-US": {
      code: "en-US",
      path: "en",
      label: "English",
    },
    // 示例：如果是阿拉伯语，可以在这里强制覆盖
    // "ar-EG": { code: "ar-EG", path: "ar-eg", label: "العربية", dir: "rtl" }
  },
  TRANSLATIONS: {
    "zh-CN": zh_CN,
    "en-US": en_US,
  },
};
