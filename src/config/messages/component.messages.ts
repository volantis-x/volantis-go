export const messages = {
  en: {
    // --- TopNav Component Warnings ---
    warn_topnav_visibility_insufficient_for_two_columns: `Component 'TopNav': This layout requires at least two visible elements (logo, menu, or actions). Please review the 'visible' settings in your "header.config.ts" under "TOP_NAV" to ensure at least two are true.`,
    warn_topnav_visibility_insufficient_for_three_columns: `Component 'TopNav': This layout is configured for three columns and requires all 'logo', 'menu', and 'actions' to be visible. Please set their 'visible' properties to true in "header.config.ts" under "TOP_NAV".`,

    // --- TopNav 布局和行为警告 ---
    warn_topnav_single_column_unsupported: (themeNameFromArg: string) =>
      `Component 'TopNav': The current theme ("${themeNameFromArg}") does not support the 'one-column' layout. The configuration 'contentLayout: "one"' in "header.config.ts" has been defaulted to 'two'.`,
    warn_topnav_fixed_behavior_unsupported: (themeNameFromArg: string) =>
      `Component 'TopNav': The current theme ("${themeNameFromArg}") does not support 'fixed' behavior. The configuration 'behavior: "fixed"' in "header.config.ts" has been defaulted to 'sticky'.`,

    // --- Marquee Component Info ---
    info_marquee_using_default_config: `Component 'Marquee': No theme or user configuration found. Using component's base default settings.`,
  },
  cn: {
    // --- TopNav Component Warnings ---
    warn_topnav_visibility_insufficient_for_two_columns: `组件 'TopNav': 当前布局至少需要两个可见元素 (logo, menu, 或 actions)。请检查您在 "header.config.ts" 文件 "TOP_NAV" 配置项下的 'visible' 设置，确保至少有两个为 'true'。`,
    warn_topnav_visibility_insufficient_for_three_columns: `组件 'TopNav': 当前布局配置为三列样式，需要 'logo'、'menu' 和 'actions' 全部可见。请在 "header.config.ts" 文件 "TOP_NAV" 配置项下将它们的 'visible' 属性都设置为 'true'。`,

    // --- TopNav 布局和行为警告 ---
    warn_topnav_single_column_unsupported: (themeNameFromArg: string) =>
      `组件 'TopNav': 当前主题 ("${themeNameFromArg}") 不支持 '单列' 布局。在 "header.config.ts" 中的配置 'contentLayout: "one"' 已被回退为 'two'。`,
    warn_topnav_fixed_behavior_unsupported: (themeNameFromArg: string) =>
      `组件 'TopNav': 当前主题 ("${themeNameFromArg}") 不支持 'fixed' (固定) 行为。在 "header.config.ts" 中的配置 'behavior: "fixed"' 已被回退为 'sticky'。`,

    // --- Marquee Component Info ---
    info_marquee_using_default_config: `组件 'Marquee': 未找到主题或用户配置。正在使用组件的基础默认设置。`,
  },
};
