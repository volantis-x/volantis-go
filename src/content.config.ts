import { defineCollection, z } from "astro:content";
import { SUPPORTED_COLLECTIONS } from "@/core/types/collections";
import { glob } from "astro/loaders";
import fs from "node:fs";
import path from "node:path";

const commonSchema = z.object({
  title: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return "Untitled";
      return val;
    })
    .pipe(
      z.string().min(1, {
        message: `
          WARNING-ZH: 标题【title】字数至少 1 个字符起，请保持标题在 30 个汉字以内。
          WARNING-EN: Title must be at least 1 character long, Please keep title under 60 characters.
          `,
      }),
    ),
  description: z
    .string()
    .min(10, {
      message: `
          WARNING-ZH: 描述【Description】字数至少 10 个字符起。
          WARNING-EN: Description must be at least 10 character long.
          `,
    })
    .optional(),
  date: z.coerce
    .date()
    .nullable()
    .optional()
    .transform((val) => val || new Date()),
  author: z.string().optional(),

  // 宽松的 categories 和 tags 处理
  categories: z
    .union([z.string(), z.array(z.string()), z.null()])
    .transform((val) => {
      if (!val) return ["others"];
      return Array.isArray(val) ? val : [val];
    })
    .default(["others"]),
  tags: z
    .union([z.string(), z.array(z.string()), z.null()])
    .transform((val) => {
      if (!val) return ["others"];
      return Array.isArray(val) ? val : [val];
    })
    .default(["others"]),

  draft: z.boolean().default(false).optional(),
  image: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  cover: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  pageType: z
    .enum(["website", "article", "profile", "product", "blog"])
    .default("blog")
    .optional(),
});

// 支持扩展 Schema
function createCollection(folderName: string, extraSchema?: z.ZodRawShape) {
  // 如果传入了 extraSchema，就用 extend 合并；否则直接用 commonSchema
  const finalSchema = extraSchema
    ? commonSchema.extend(extraSchema)
    : commonSchema;

  return defineCollection({
    loader: glob({
      pattern: "**/*.(md|mdx|mdoc)",
      base: `./content/${folderName}`,
    }),
    schema: finalSchema,
  });
}

// 定义集合
const loadedCollections: Record<string, any> = {};

// 定义引用 Schema
// 允许: "Chrome" (纯文本)
// 允许: { name: "Chrome", slug: "google-chrome", collection: "apps" }
const referenceSchema = z.union([
  z.string(),
  z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    collection: z.enum(SUPPORTED_COLLECTIONS).optional(), // 限制集合范围更安全，或者用 string()
    url: z.string().url().optional(),
    icon: z.string().optional(),
  }),
]);

// 定义特殊集合的扩展字段
const schemaExtensions: Record<string, z.ZodRawShape> = {
  // === Plugins ===
  plugins: {
    // 宿主: 可以是多个，支持跨集合引用
    plugins_host: z.array(referenceSchema).optional(),

    // 同类/关联插件
    plugins_related: z.array(referenceSchema).optional(),
  },

  // === Apps ===
  apps: {
    apps_download: z.string().url().optional(),
    // 关联应用
    apps_related: z.array(referenceSchema).optional(),
  },

  // === Projects ===
  projects: {
    projects_type: z
      .enum(["standalone", "library", "plugin", "theme", "other"])
      .default("standalone"),
    // 项目依赖/宿主
    projects_host: z.array(referenceSchema).optional(),
    projects_related: z.array(referenceSchema).optional(),
  },
};

for (const name of SUPPORTED_COLLECTIONS) {
  const dirPath = path.join(process.cwd(), "content", name);

  if (fs.existsSync(dirPath)) {
    // 2. 检查目录是否为空 (这步很关键！)
    const files = fs.readdirSync(dirPath);
    // 简单的检查：是否有文件（不一定是 md，但至少要有东西）
    // 如果想要更严谨，可以检查是否有 .md/.mdx 等后缀
    const hasContent = files.some((file) => !file.startsWith(".")); // 忽略 .DS_Store

    if (hasContent) {
      // 传入对应的扩展 Schema (如果有的话)
      loadedCollections[name] = createCollection(name, schemaExtensions[name]);
    }
  }
}

// 4. 导出动态生成的集合
// 此时，只有 content 下真实存在的文件夹对应的 key 才会出现在这里
export const collections = loadedCollections;
