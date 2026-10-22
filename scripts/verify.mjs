import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve("dist");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : join(directory, entry.name),
      ),
    )
  ).flat();
}
const files = (await walk(root)).filter((file) => file.endsWith(".html") && !file.endsWith("googlec22201e78a0a77b2.html"));
const errors = [];
const titles = new Set();
const descriptions = new Set();
let links = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  if (!title || titles.has(title))
    errors.push(`Título ausente ou repetido: ${file}`);
  titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!description || descriptions.has(description)) errors.push(`Descrição ausente ou repetida: ${file}`);
  descriptions.add(description);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`Quantidade de H1 inválida: ${file}`);
  for (const name of ["description", "robots", "twitter:card"])
    if (!html.includes(`name="${name}"`))
      errors.push(`Meta ${name} ausente: ${file}`);
  if (!html.includes('rel="canonical"'))
    errors.push(`Canonical ausente: ${file}`);
  for (const json of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )) {
    try {
      JSON.parse(json[1]);
    } catch {
      errors.push(`Schema inválido: ${file}`);
    }
  }
  for (const script of html.matchAll(/<script\b([^>]*)>/g)) {
    const attributes = script[1];
    if (attributes.includes("application/ld+json")) continue;
    if (attributes.includes("data-intro-bootstrap")) continue;
    if (
      !attributes.includes('type="module"') ||
      !/src="\/_astro\/[^"\s]+\.js"/.test(attributes)
    )
      errors.push(`Script fora do bundle local esperado: ${file}`);
  }
  for (const link of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const path = link[1];
    const target = join(root, path.endsWith("/") ? `${path}index.html` : path);
    try {
      await stat(target);
      links++;
    } catch {
      errors.push(`Link interno sem destino: ${path} em ${file}`);
    }
  }
}
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const llms = await readFile(join(root, "llms.txt"), "utf8");
if (!llms.includes("Cambuí") || !llms.includes("Nova Campinas") || !llms.includes("WhatsApp")) errors.push("Informações locais ausentes em llms.txt");
if (sitemap.includes("404")) errors.push("Página 404 indevidamente incluída no sitemap");
const summary = {
  pages: files.length,
  sitemapUrls: (sitemap.match(/<loc>/g) || []).length,
  internalReferences: links,
  errors,
};
await mkdir("reports", { recursive: true });
await writeFile("reports/verification.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exitCode = 1;
