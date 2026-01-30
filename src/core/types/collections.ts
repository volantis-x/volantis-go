// 这里定义系统支持的所有内容类型
// 后续如果增加了 'vlog' 或 'products'，只需在这里添加
export const SUPPORTED_COLLECTIONS = [
  // 1. 基础页面 (特殊路由)
  "pages",

  // 2. 资讯流 (时间流)
  "blog", // 博客
  "changelog", // 更新日志
  "news", // 新闻/动态
  "notes", // 随笔/闪念

  // 3. 知识库 (结构化)
  "docs", // 文档/教程
  "essays", // 深度研究/心得/专栏 (Research & Thoughts)
  "guides", // 较长的教程 (Tutorials) 可选，如果觉得 Tips 太短的话
  "snippets", // 代码片段
  "tips", // 技巧/心得

  // 4. 展示与实体 (项目/产品)
  "apps", // 软件应用
  "plugins", // 附属插件 (uBlock, Redshift)
  "products", // 产品
  "projects", // 项目/作品集

  // 5. 多媒体
  "photos", // 摄影
  "podcasts", // 播客
  "vlogs", // 视频日志

  // 6. 组织
  "team", // 团队成员 (建议新增)
] as const;

export type SupportedCollection = (typeof SUPPORTED_COLLECTIONS)[number];
