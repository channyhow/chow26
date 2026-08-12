import { access, copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourceRoot = resolve(process.cwd(), "..", "case-study-atmosphere");
const targetRoot = process.cwd();

const assets = [
  ["public/assets/photos/projects/paris/paris-entryway-01.jpg", "public/assets/photos/atmosphere/paris-entryway.jpg"],
  ["public/assets/photos/projects/paris/paris-bathroom-01.jpg", "public/assets/photos/atmosphere/paris-bathroom.jpg"],
  ["public/assets/photos/projects/lisbon/lisbon-living-room-01.jpg", "public/assets/photos/atmosphere/lisbon-living.jpg"],
  ["public/assets/photos/projects/lisbon/lisbon-patio-01.jpg", "public/assets/photos/atmosphere/lisbon-patio.jpg"],
  ["public/assets/photos/projects/lisbon/lisbon-entryway-portrait-01.jpg", "public/assets/photos/atmosphere/lisbon-entryway.jpg"],
  ["public/assets/photos/projects/bali/bali-entryway-01.jpg", "public/assets/photos/atmosphere/bali-entryway.jpg"],
  ["public/assets/photos/projects/bali/bali-bathroom-01.jpg", "public/assets/photos/atmosphere/bali-bathroom.jpg"]
];

for (const [from, to] of assets) {
  const source = resolve(sourceRoot, from);
  const target = resolve(targetRoot, to);
  await access(source);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  console.log(`✓ ${to}`);
}

console.log(`Imported ${assets.length} curated Atmosphere assets from ../case-study-atmosphere.`);
