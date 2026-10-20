import fs from "node:fs";
import path from "node:path";

const root = path.resolve("dist");
const errors = [];
const checked = new Set();
function check(reference, relativeTo = root) {
  if (!reference || /^(?:https?:|data:|#|mailto:|tel:)/i.test(reference)) return;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  const target = path.resolve(relativeTo, clean.replace(/^\//, ""));
  if (!target.startsWith(root + path.sep)) { errors.push(`Referência fora do pacote: ${reference}`); return; }
  checked.add(target);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { errors.push(`Arquivo ausente: ${path.relative(root, target)}`); return; }
  // Windows ignores case; most Linux hosts do not.
  let current = root;
  for (const part of path.relative(root, target).split(path.sep)) {
    if (!fs.readdirSync(current).includes(part)) { errors.push(`Maiúsculas/minúsculas incompatíveis: ${reference}`); break; }
    current = path.join(current, part);
  }
}
if (!fs.existsSync(path.join(root, "index.html"))) throw new Error("Execute npm run build antes da verificação.");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) check(match[1]);
const sources = ["src/lp_nataleluia_landing_page.jsx", "src/AccessibilityWidget.jsx", "src/BorderGlow.jsx"];
for (const file of sources) {
  check(file);
  const text = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of text.matchAll(/["'`](\.\/assets\/[^"'`\s?]+)/g)) check(match[1]);
}
for (const file of ["js/lp-boot.js", "js/landing-loader.js", "robots.txt"]) check(file);
for (const file of fs.readdirSync(path.join(root, "assets")).filter((name) => name.endsWith(".css"))) {
  const location = path.join(root, "assets", file);
  for (const match of fs.readFileSync(location, "utf8").matchAll(/url\(["']?([^\s)'";]+)["']?\)/g)) check(match[1], path.dirname(location));
}
for (const excluded of [".git", ".env", "node_modules", "public", "restore", "serve.mjs", "package.json"]) {
  if (fs.existsSync(path.join(root, excluded))) errors.push(`Arquivo/pasta de desenvolvimento no upload: ${excluded}`);
}
if (/YOUR_DOMAIN/.test(html)) errors.push("Domínio de exemplo no HTML publicado.");
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`Publicação verificada: ${checked.size} referências locais, nomes compatíveis com Linux e pacote sem pastas de desenvolvimento.`);
