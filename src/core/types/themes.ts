/**
 * 1. 定义系统支持的主题列表 (运行时常量)
 * 使用 'as const' 锁定数组内容，使其变为只读元组，这样 TS 才能推导出精确的字面量类型。
 */
export const SUPPORTED_THEMES = ["base"] as const;

/**
 * 2. 导出主题的键名类型 (静态类型)
 * 这是一个联合类型如：'base' | 'move' | 'test'
 * 含义：它代表了“选哪个主题”，是一个字符串 ID。
 */
export type ThemeKey = (typeof SUPPORTED_THEMES)[number];

/**
 * 3. 主题元数据接口
 * 主题加描述、作者、版本等信息
 */
export interface ThemeMetadata {
  key: ThemeKey;
  label?: string; // 显示在 UI 上的名字，如 "Base Theme"，后续考虑如何 i18n
  author?: string;
  url?: URL;
  version?: string;
}
