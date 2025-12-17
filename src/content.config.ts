import { defineCollection, z } from "astro:content";
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
      })
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

const POTENTIAL_COLLECTIONS = ["blog", "docs", "news", "note", "vlog"];

// 3. 动态生成集合对象
const loadedCollections: Record<string, any> = {};

for (const name of POTENTIAL_COLLECTIONS) {
  // 检查 content/xxx 目录是否存在
  // process.cwd() 获取的是项目根目录
  const dirPath = path.join(process.cwd(), "content", name);

  if (fs.existsSync(dirPath)) {
    // 2. 检查目录是否为空 (这步很关键！)
    const files = fs.readdirSync(dirPath);
    // 简单的检查：是否有文件（不一定是 md，但至少要有东西）
    // 如果想要更严谨，可以检查是否有 .md/.mdx 等后缀
    const hasContent = files.some((file) => !file.startsWith(".")); // 忽略 .DS_Store

    if (hasContent) {
      loadedCollections[name] = defineCollection({
        loader: glob({
          pattern: "**/*.(md|mdx|mdoc)",
          base: `./content/${name}`,
        }),
        schema: commonSchema,
      });
    }
  } else {
    // 可以在开发模式下提示一下，或者保持静默
    // console.log(`⚙️ [ Volantis ] Skipping collection '${name}' (directory not found).`);
  }
}

// 4. 导出动态生成的集合
// 此时，只有 content 下真实存在的文件夹对应的 key 才会出现在这里
export const collections = loadedCollections;
