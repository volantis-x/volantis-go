import type { APIRoute } from "astro";

const robotsTxt =
  import.meta.env.SITE === "http://localhost"
    ? `
User-agent: *
Allow: /
`.trim()
    : `
User-agent: *
Allow: /
Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
