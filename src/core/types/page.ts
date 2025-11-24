export type Frontmatter = {
  title?: string;
  description?: string;
  date?: string | Date | undefined;
  author?: string;
  categories?: string[];
  tags?: string[];
  draft?: boolean;
  image?: { src: string; alt?: string };
  cover?: { src: string; alt?: string };
  pageType?: "website" | "article" | "profile" | "product" | "blog";
};
