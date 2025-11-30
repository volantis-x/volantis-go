import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CONFIG } from "@userConfig/site.config";

const DEFAULT_AUTHOR =
  CONFIG.DEFAULT_AUTHOR !== undefined && CONFIG.DEFAULT_AUTHOR;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.(md|mdx|mdoc)", base: "./content/blog" }),
  schema: z.object({
    title: z
      .string()
      .nullable() // 允许 title: null
      .optional() // 允许完全没有 title 字段
      .transform((val) => {
        // 如果是 null, undefined 或 空字符串，返回默认标题
        if (!val || val.trim() === "") {
          return "Untitled";
        }
        return val;
      })
      // 验证逻辑放在 transform 之后，确保即使是默认标题也能通过验证
      .pipe(
        z.string().min(1, {
          message: `
          WARNING-ZH: 标题【title】字数至少 1 个字符起，请保持标题在 30 个汉字以内。
          WARNING-EN: Title must be at least 1 character long, Please keep title under 60 characters.
          `,
        }),
        // .max(60, {
        //   message: `
        // WARNING-ZH: 标题【title】字数超出 60 个字符，请保持标题在 30 个汉字以内。
        // WARNING-EN: Title exceeds 60 characters.
        // `,
        // }),
      ),
    description: z
      .string()
      .min(10, {
        message: `
          WARNING-ZH: 描述【Description】字数至少 10 个字符起。
          WARNING-EN: Description must be at least 10 character long.
          `,
      })
      // .max(140, {
      //   message: `
      //     WARNING-ZH: 描述【Description】字数超出 140 个字符，请保持描述在 70 个汉字以内。
      //     WARNING-EN: Description exceeds 140 characters.
      //     `,
      // })
      .optional(),
    date: z.coerce
      .date()
      .nullable() // 允许 date: null
      .optional() // 允许不写
      .transform((val) => val || new Date()), // 如果为空，默认当前时间
    author: z
      .string()
      .default(DEFAULT_AUTHOR || "Admin")
      .optional(),
    categories: z
      // 允许: 字符串 OR 字符串数组 OR null (空的 categories:)
      .union([z.string(), z.array(z.string()), z.null()])
      .transform((val) => {
        // 如果是 null (空值) 或空字符串，返回默认数组
        if (!val) return ["others"];
        // 如果是字符串，转为数组；如果是数组，保持原样
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
  }),
});

export const collections = { blog };
