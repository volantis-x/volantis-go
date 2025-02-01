import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CONFIG } from "@/config/site.config";

const DEFAULT_AUTHOR = CONFIG.DEFAULT_AUTHOR !== undefined && CONFIG.DEFAULT_AUTHOR;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx|mdoc)', base: './content/blog' }),
  schema: z.object({
    title: z
      .string()
      .min(1, {
        message: `
      WARNING-ZH: 标题【title】字数至少 1 个字符起，请保持标题在 30 个汉字以内。
      WARNING-EN: Title must be at least 1 character long, Please keep title under 60 characters.
      `,
      })
      .max(60, {
        message: `
      WARNING-ZH: 标题【title】字数超出 60 个字符，请保持标题在 30 个汉字以内。
      WARNING-EN: Title exceeds 60 characters.
      `,
      }),
    description: z
      .string()
      .min(10, {
        message: `
      WARNING-ZH: 描述【Description】字数至少 10 个字符起，请保持描述在 70 个汉字以内。
      WARNING-EN: Description must be at least 10 character long, Please keep title under 140 characters.
      `,
      })
      .max(140, {
        message: `
      WARNING-ZH: 描述【Description】字数超出 140 个字符，请保持描述在 70 个汉字以内。
      WARNING-EN: Description exceeds 140 characters.
      `,
      })
      .optional(),
    date: z.date().optional(),
    author: z
      .string()
      .default(DEFAULT_AUTHOR || "Admin")
      .optional(),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
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
