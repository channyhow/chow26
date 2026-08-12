import { access, cp, copyFile, mkdir } from "node:fs/promises";
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

const copySingleFile = async (relativePath, targetRelativePath = relativePath) => {
  const source = resolve(sourceRoot, relativePath);
  const target = resolve(targetRoot, targetRelativePath);
  await access(source);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`✓ ${targetRelativePath}`);
};

for (const folder of projectFolders) {
  await copyDirectory(`public/assets/photos/work/${folder}`);
}

await copyDirectory("public/assets/photos/brand");
await copySingleFile("public/assets/photos/portrait shot.jpg");
await copySingleFile("public/assets/photos/homepage31200.webp");

for (const icon of [
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
]) {
  await copySingleFile(`public/${icon}`);
}

for (const video of [
  "kuro-compressed.mp4",
  "maloya-compressed.mp4",
  "ravine_branding.mp4",
]) {
  await copySingleFile(`public/assets/videos/${video}`);
}

const activeFonts = [
  "DMSans-VariableFont_opsz,wght.ttf",
  "DMSans-Italic-VariableFont_opsz,wght.ttf",
  "FlorDeRuina-Semilla.woff2",
];

for (const fontName of activeFonts) {
  await copySingleFile(`public/assets/fonts/${fontName}`);
}

console.log(`Imported ${projectFolders.length} project folders, brand assets, homepage image, Chow root icons, portrait, 3 videos and ${activeFonts.length} active Chow Studio font files from ../chowchow26.`);
console.log("Excluded the oversized Maloya PNG and unused Ravine hero-scroll video.");
