// Turns the Vite build into:
//   release/sanguine-landing.html  – one self-contained file (open in a browser to preview)
//   release/sanguine-landing.zip   – WordPress plugin (Plugins → Add New → Upload Plugin)
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const out = join(root, "release");
const read = (p) => readFileSync(join(dist, p.replace(/^\//, "")), "utf8");

let html = read("index.html");

html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_, href) => `<style>${read(href)}</style>`);
html = html.replace(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_, src) => `<script type="module">${read(src).replace(/<\/script/gi, "<\\/script")}</script>`,
);
const favicon = Buffer.from(read("favicon.svg")).toString("base64");
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${favicon}"`);

if (/(src|href)="\/assets\//.test(html)) throw new Error("Unresolved asset reference left in HTML");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "sanguine-landing.html"), html);

const pluginDir = join(out, "sanguine-landing");
cpSync(join(root, "wordpress-plugin"), pluginDir, { recursive: true });
writeFileSync(join(pluginDir, "landing.html"), html);
execFileSync("zip", ["-qr", "sanguine-landing.zip", "sanguine-landing"], { cwd: out });
rmSync(pluginDir, { recursive: true, force: true });

if (!existsSync(join(out, "sanguine-landing.zip"))) throw new Error("Plugin zip was not created");
console.log(`release/sanguine-landing.html (${(html.length / 1024).toFixed(0)} KB)`);
console.log("release/sanguine-landing.zip");
