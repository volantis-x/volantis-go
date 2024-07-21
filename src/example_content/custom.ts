// 引入类型声明
// Introduce type declaration
import type { Config, MarqueeTOP, Metadata } from "@/content/types";

// 在这里设置你的网站地址，请以 "http://" 或者 "https://" 开头
// Set your website address here, please start with "http://" or "https://"
// 如果暂时不想设置，请保持默认值："http://example.com"
// If you do not want to set it yet, please keep the default value: "http://example.com"
export const SITE: string = "http://example.com";

// 网站相关信息
// Website related information
export const CONFIG: Config = {
  // 设置网站的默认图标
  // Set the default icon for the website
  FAVICON: "favicon.ico",

  // 设置网站的默认语言
  // Set the default language for your website, for example "en"
  DEFAULT_LOCALE: "zh-cn",

  // 全站文本内容书写方向:
  // ltr = 从左到右，默认值，用于从左向右书写的语言（比如英语、中文等）
  // rtl = 从右到左，用于从右向左书写的语言（比如阿拉伯语）
  // The writing direction of the text content of the whole site:
  // ltr = left to right, default value, used for languages ​​written from left to right (such as English, Chinese, etc.)
  // rtl = right-to-left, for languages ​​written from right to left (such as Arabic)
  DIR: "ltr",

  // 网站标题
  // Website title
  TITLE: "Volantis GO",

  // 网站描述
  // Website description
  DESCRIPTION: "A content site built with Astro",

  // 默认作者
  // Default author
  AUTHOR: "Admin",

  // 是否启用在页面标题后面加上网站标题，仅字数不多时增加
  // Whether to enable adding the website title after the page title, and only increase it when the number of words is small
  ADD_TITLE: true,

  // 分隔符选择: true = "|" , false = "-" , 只有 ADD_TITLE = true 时生效.
  // Delimiter selection: true = "|" , false = "-" , only takes effect when ADD_TITLE = true.
  DELIMITER: false,

  // 是否启用视图过渡动画: true = 启用, false = 禁用.
  // Use view transitions: true = enable, false = Disable
  VIEW_TRANSITIONS: true,
};

// 顶部横条配置，启用时，全部所有页面将显示
// Marquee top config, enabled on all pages when true
export const MARQUEE_TOP: MarqueeTOP = {
  // 顶部横条使用开关，只有设置为 true 才启用。不使用，请设置为 false
  // Enable / disable marquee top
  ENABLE: true,

  // 横条内容的移动方向, left = 向左移动, right = 向右移动
  // Direction of movement of the marquee top content, left = leftward, right = rightward
  DIRECTION: "left",

  // 横条的首要内容
  // The primary content of the marquee top
  PRIMARY_CONTENT: "Welcome to Volantis GO",

  // 横条的次要内容
  // Secondary content in the mobile marquee top
  SECONDARY_CONTENT: "A content site built with Astro",
};

// 网站首页的页面信息
// Page information on the homepage of the website
export const HOME: Metadata = {
  // 网站首页的标题
  // The title of the homepage of the website
  TITLE: "Home",

  // 网站首页的描述
  // Description of website homepage
  DESCRIPTION: "Welcome to Volantis GO",
};
