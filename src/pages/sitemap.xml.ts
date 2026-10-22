import type { APIRoute } from "astro";
import { services } from "../data/services";
import { articles } from "../data/articles";
export const GET: APIRoute = ({ site }) => {
  const base = site || new URL("https://priscilamassagemsp.com.br");
  const paths = [
    "/",
    "/sobre-priscila/",
    "/especialidades/",
    "/depoimentos/",
    "/blog/",
    "/contato/",
    "/politica-de-privacidade/",
    ...services.map((item) => `/especialidades/${item.slug}/`),
    ...articles.map((item) => `/${item.slug}/`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${new URL(path, base).href.replace(/&/g, "&amp;")}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
