// 这里定义系统支持的所有内容类型
// 后续如果增加了 'vlog' 或 'products'，只需在这里添加
export const SUPPORTED_COLLECTIONS = ["blog", "docs", "news", "note"] as const;

export type SupportedCollection = (typeof SUPPORTED_COLLECTIONS)[number];
