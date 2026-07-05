import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = resolve(root, "src/tagcss.css");
const distFile = resolve(root, "dist/tagcss.css");
const minFile = resolve(root, "dist/tagcss.min.css");
const layeredFile = resolve(root, "dist/tagcss.layered.css");
const resetlessFile = resolve(root, "dist/tagcss.resetless.css");
const resetlessMinFile = resolve(root, "dist/tagcss.resetless.min.css");

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~()])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function removeLayerBlock(css, layerName) {
  const marker = `@layer ${layerName}`;
  const start = css.indexOf(marker);

  if (start === -1) {
    return css;
  }

  const open = css.indexOf("{", start);
  if (open === -1) {
    return css;
  }

  let depth = 0;

  for (let index = open; index < css.length; index += 1) {
    const char = css[index];

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
    }

    if (depth === 0) {
      return `${css.slice(0, start)}${css.slice(index + 1)}`.replace(/\n{3,}/g, "\n\n");
    }
  }

  return css;
}

await mkdir(resolve(root, "dist"), { recursive: true });

const css = await readFile(sourceFile, "utf8");
const resetlessCss = removeLayerBlock(css, "reset");

await writeFile(distFile, css);
await writeFile(layeredFile, css);
await writeFile(minFile, `${minifyCss(css)}\n`);
await writeFile(resetlessFile, resetlessCss);
await writeFile(resetlessMinFile, `${minifyCss(resetlessCss)}\n`);

console.log("Built TagCss distribution files");
