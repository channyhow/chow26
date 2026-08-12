import { access, cp, copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourceRoot = resolve(process.cwd(), "..", "chowchow26");
const targetRoot = process.cwd();

const projectFolders = [
  "atmosphere",
  "contraste",
  "kuro",
  "maloya",
  "mois-du-ker",
  "randorun",
  "ravine",
  "sashayogaflow",
  "structure",
];

const excludedBasenames = new Set([
  "mobile_mockup_multi.png",
  "ravine_hero_scroll.mp4",
]);

const copyDirectory = async (relativePath) => {
  const source = resolve(sourceRoot, relativePath);
  const target = resolve(targetRoot, relativePath);
  await access(source);
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, {
    recursive: true,
    force: true,
    filter: (path) => !excludedBasenames.has(path.split(/[\\/]/).pop()),
  });
  console.log(`✓ ${relativePath}`);
};

const copySingleFile = async (relativePath) => {
  const source = resolve(sourceRoot, relativePath);
  const target = resolve(targetRoot, relativePath);
  await access(source);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`✓ ${relativePath}`);
};

for (const folder of projectFolders) {
  await copyDirectory(`public/assets/photos/work/${folder}`);
}

await copyDirectory("public/assets/photos/brand");
await copySingleFile("public/assets/photos/portrait shot.jpg");

for (const video of [
  "kuro-compressed.mp4",
  "maloya-compressed.mp4",
  "ravine_branding.mp4",
]) {
  await copySingleFile(`public/assets/videos/${video}`);
}

const sourceFontsDir = resolve(sourceRoot, "public/assets/fonts");
const fontNames = (await readdir(sourceFontsDir)).filter((name) =>
  /^(AveriaSerifLibre-|Butler-Free-)/.test(name),
);

for (const fontName of fontNames) {
  await copySingleFile(`public/assets/fonts/${fontName}`);
}

console.log(`Imported ${projectFolders.length} project folders, brand assets, portrait, 3 videos and ${fontNames.length} Butler/Averia font files from ../chowchow26.`);
console.log("Excluded the oversized Maloya PNG and unused Ravine hero-scroll video.");
