// 引入类型声明
// Introduce type declaration
import type { Metadata, Config } from '@/content/types';

// 在这里设置你的网站地址，请以 'http://' 或者 'https://' 开头
// Set your website address here, please start with 'http://' or 'https://'
// 如果暂时不想设置，请保持默认值：'http://example.com'
// If you do not want to set it yet, please keep the default value: 'http://example.com'
export const SITE = 'http://example.com';

// 网站相关信息
// Website related information
export const CONFIG: Config = {
  // 设置网站的默认图标
  // Set the default icon for the website
  FAVICON: 'favicon.ico',
  // 设置网站的默认语言
  // Set the default language for your website
  DEFAULT_LOCALE: 'zh-cn',
  // 网站标题
  // Website title
  TITLE: 'Volantis GO',
  // 网站描述
  // Website description
  DESCRIPTION: 'A content site built with Astro',
  // 是否启用视图过渡动画: true = 启用, false = 禁用.
  // Use view transitions: true = enable, false = Disable
  VIEW_TRANSITIONS: true,
  // 默认作者
  // Default author
  AUTHOR: 'Admin',
};

// 网站首页的页面信息
// Page information on the homepage of the website
export const HOME: Metadata = {
  // 网站首页的标题
  // The title of the homepage of the website
  TITLE: 'Home',
  // 网站首页的描述
  // Description of website homepage
  DESCRIPTION: 'Welcome to Volantis GO',
};

