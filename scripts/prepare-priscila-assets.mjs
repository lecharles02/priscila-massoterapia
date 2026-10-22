import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('assets-source/Pri');
const groups = [
  ['HERO', 'hero', 1920],
  ['Foto sobre mim', 'about', 1000],
  ['Foto para o cta final', 'cta', 1920],
  ['foto para tela de carregamento incial', 'intro', 1600],
  ['Galeria de fotos dela', 'gallery', 900],
];
await mkdir('public/images', { recursive: true });
const files = [];
for (const [folder, prefix, width] of groups) {
  const names = (await readdir(path.join(root, folder))).filter(name => /\.(png|jpe?g)$/i.test(name)).sort();
  for (let index = 0; index < names.length; index++) {
    const filename = `${prefix}-${index + 1}.webp`;
    const original = path.join(root, folder, names[index]);
    const output = `public/images/${filename}`;
    const info = await sharp(original).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(output);
    files.push({ original: path.relative(root, original), src: `/images/${filename}`, width: info.width, height: info.height, bytes: info.size });
  }
}
await writeFile('reports/priscila-images.json', JSON.stringify(files, null, 2));
const tiles = await Promise.all(files.map(async file => ({input: await sharp(`public${file.src}`).resize(240, 180, {fit:'contain',background:'#f5f3f6'}).png().toBuffer()})));
await sharp({create:{width:960,height:Math.ceil(tiles.length/4)*210,channels:3,background:'#fff'}})
  .composite(tiles.map((tile,index)=>({input:tile.input,left:(index%4)*240,top:Math.floor(index/4)*210})))
  .png().toFile('reports/priscila-contact-sheet.png');
console.log(JSON.stringify(files));
