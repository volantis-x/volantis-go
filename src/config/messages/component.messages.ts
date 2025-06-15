import { ACTIVE_THEME_NAME } from '@/config/app';

export const messages = {
  en: {
    // --- TopNav Component Warnings ---
    warn_topnav_requires_two_elements: `Component 'TopNav': The current theme requires at least two visible elements (logo, menu, or actions). Please check your settings.`,
    warn_topnav_requires_three_elements: `Component 'TopNav': This layout requires all three elements (logo, menu, actions) to be visible.`,

    // --- TopNav 布局和行为警告 ---
    warn_topnav_single_column_unsupported: () =>
      `Component 'TopNav': The current theme ("${ACTIVE_THEME_NAME}") does not support the 'one-column' layout. The configuration 'contentLayout: "one"' in "header.config.ts" has been defaulted to 'two-columns'.`,
    warn_topnav_fixed_behavior_unsupported: () =>
      `Component 'TopNav': The current theme ("${ACTIVE_THEME_NAME}") does not support 'fixed' behavior. The configuration 'behavior: "fixed"' in "header.config.ts" has been defaulted to 'sticky'.`,

    // --- Marquee Component Info ---
    info_marquee_using_default_config: `Component 'Marquee': No theme or user configuration found. Using component's base default settings.`,
  },
  cn: {
    // --- TopNav Component Warnings ---
    warn_topnav_requires_two_elements: `组件 'TopNav': 当前主题要求至少有两个可见元素 (logo, menu, actions)。请检查您的配置。`,
    warn_topnav_requires_three_elements: `组件 'TopNav': 此布局要求所有三个元素 (logo, menu, actions) 都可见。`,

    // --- TopNav 布局和行为警告 ---
    warn_topnav_single_column_unsupported: () =>
      `组件 'TopNav': 当前主题 ("${ACTIVE_THEME_NAME}") 不支持 '单列' 布局。在 "header.config.ts" 中的配置 'contentLayout: "one"' 已被回退为 '双列'。`,
    warn_topnav_fixed_behavior_unsupported: () =>
      `组件 'TopNav': 当前主题 ("${ACTIVE_THEME_NAME}") 不支持 'fixed' (固定) 行为。在 "header.config.ts" 中的配置 'behavior: "fixed"' 已被回退为 'sticky'。`,

    // --- Marquee Component Info ---
    info_marquee_using_default_config: `组件 'Marquee': 未找到主题或用户配置。正在使用组件的基础默认设置。`,
  },
};
