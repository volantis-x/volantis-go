import type { Config, Metadata } from "@/types/config";

// 在这里设置你的网站地址，请以 "http://" 或者 "https://" 开头
// Set your website address here, please start with "http://" or "https://"
// 如果暂时不想设置，请保持默认值："http://example.com"
// If you do not want to set it yet, please keep the default value: "http://example.com"
export const SITE: string = "http://example.com";

// 网站主题风格，默认为 "base"
// Website theme style, defaults to "base"
export const UserTheme: string = "base";

// 网站相关信息
// Website related information
export const CONFIG: Config = {
  // 全站文本内容书写方向:
  // ltr = 从左到右，默认值，用于从左向右书写的语言（比如英语、中文等）
  // rtl = 从右到左，用于从右向左书写的语言（比如阿拉伯语）
  // The writing direction of the text content of the whole site:
  // ltr = left to right, default value, used for languages ​​written from left to right (such as English, Chinese, etc.)
  // rtl = right-to-left, for languages ​​written from right to left (such as Arabic)
  DIR: "ltr",

  // 设置网站的默认图标
  // Set the default icon for the website
  FAVICON: "favicon.ico",

  // 设置网站的默认语言
  // Set the default language for your website, for example "en"
  DEFAULT_LOCALE: "zh-cn",

  // 网站标题。显示在浏览器标签页和社交媒体分享中。
  // Website title. Displayed in browser tab and social media shares.
  DEFAULT_TITLE: "Volantis GO",

  // 网站简短描述。用于搜索引擎优化和社交媒体分享。
  // Short website description. Used for SEO and social media shares.
  DEFAULT_DESCRIPTION: "A content site built with Astro",

  // 默认作者名称。用于文章元数据和作者页面。
  // Default author name. Used for article metadata and author pages.
  DEFAULT_AUTHOR: "Admin",

  // 是否在页面标题后添加网站标题。仅当标题字数较少时添加，例如 "页面标题 | 网站标题"。
  // Append website title to page titles. Only applied when the title is short, e.g., "Page Title | Website Title".
  ADD_TITLE: true,

  // 标题分隔符。仅当 ADD_TITLE 为 true 时生效。 true 使用 "|"，false 使用 "-"。
  // Title delimiter. Only takes effect when ADD_TITLE is true. True for "|", false for "-".
  DELIMITER: false,

  // 是否启用页面切换动画。
  // Enable page transition animations.
  VIEW_TRANSITIONS: true,

  // 是否启用较小字体大小 (true = 14px, false = 16px).
  // Whether to use smaller font size (true = 14px, false = 16px).
  USE_SMALLER_FONT: false,
};

// 网站首页的页面信息
// Page information on the homepage of the website
export const HOME: Metadata = {
  // 网站首页标题，用于浏览器标签页和社交媒体分享。
  // Homepage title, displayed in browser tab and social media shares.
  DEFAULT_TITLE: "Home",

  // 网站首页简短描述，用于搜索引擎优化和社交媒体分享。
  // Short homepage description, used for SEO and social media shares.
  DEFAULT_DESCRIPTION: "Welcome to Volantis GO",
};
