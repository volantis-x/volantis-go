import type { SupportedTheme } from '@/core/types/config';

// 请同步 astro.conifg.mjs 里的 ASTRO_CONFIG_SUPPORTED_THEMES 值
// Keep this in sync with the ASTRO_CONFIG_SUPPORTED_THEMES value in astro.config.mjs
// export const SUPPORTED_THEMES = ["base", "custom"] as const;
// export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

/**
 * @zh 所有受支持的主题名称列表。
 * @en A list of all supported theme names.
 * @remarks 未来这个列表可以由脚本根据 `src/themes` 目录下的文件夹自动生成。
 */
export const SUPPORTED_THEMES = ["base"] as const;;

/**
 * @zh 不支持 'fixed' 头部行为的主题列表。
 * @en A list of themes that do not support the 'fixed' header behavior.
 * @remarks 这是一个临时的解决方案。未来将通过 theme.meta.ts 由主题自我声明。
 */
export const FIXED_TO_STICKY_THEMES: SupportedTheme[] = ["base"];

/**
 * @zh 不支持 '单列' 顶部导航布局的主题列表。
 * @en A list of themes that do not support the 'one-column' top navigation layout.
 * @remarks 这是一个临时的解决方案。未来将通过 theme.meta.ts 由主题自我声明。
 */
export const SINGLE_COLUMN_UNSUPPORTED_THEMES: SupportedTheme[] = ["base"];
