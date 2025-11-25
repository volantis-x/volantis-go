import type { ThemeKey } from '../core/types/themes';

/**
 * @zh 不支持 'fixed' 头部行为的主题列表。
 * @en A list of themes that do not support the 'fixed' header behavior.
 * @remarks 这是一个临时的解决方案。未来将通过 theme.meta.ts 由主题自我声明。
 */
export const FIXED_TO_STICKY_THEMES: ThemeKey[] = ["base"];

/**
 * @zh 不支持 '单列' 顶部导航布局的主题列表。
 * @en A list of themes that do not support the 'one-column' top navigation layout.
 * @remarks 这是一个临时的解决方案。未来将通过 theme.meta.ts 由主题自我声明。
 */
export const SINGLE_COLUMN_UNSUPPORTED_THEMES: ThemeKey[] = ["base"];
