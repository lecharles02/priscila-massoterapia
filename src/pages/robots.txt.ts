import type { APIRoute } from "astro";
export const GET: APIRoute = ({ site }) => {
  const base = site || new URL("https://priscilamassagemsp.com.br");
  const preview = ["localhost", "127.0.0.1"].includes(base.hostname);
  return new Response(
    `User-agent: *\n${preview ? "Disallow: /" : "Allow: /"}\n\nSitemap: ${new URL("/sitemap.xml", base).href}\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
