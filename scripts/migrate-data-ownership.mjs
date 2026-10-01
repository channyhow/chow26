import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dataPath = (name) => resolve(root, "src", "data", name);

const readJson = async (name) => JSON.parse(await readFile(dataPath(name), "utf8"));
const writeJson = async (name, value) => {
  await writeFile(dataPath(name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const collections = await readJson("collections.json");
const globalBlocks = await readJson("globalBlocks.json");
const pages = await readJson("pages.json");

// services.json and approach.json are the canonical owners. Keep collections.json
// for collections that do not have a dedicated domain file.
delete collections.services;
delete collections.approach;

const approachDefault = globalBlocks["approach-default"];
if (approachDefault) {
  const legacyItems = approachDefault.content?.items ?? [];
  const intro = legacyItems[0];

  approachDefault.source = { collection: "approach" };
  approachDefault.content = {
    ...(approachDefault.content ?? {}),
    ...(intro
      ? {
          header: {
            ...(intro.title ? { title: intro.title } : {}),
            ...(intro.text ? { text: intro.text } : {}),
          },
        }
      : {}),
  };
  delete approachDefault.content.items;
}

const studioPage = pages.find((page) => page.id === "studio");
const studioPanels = studioPage?.blocks?.flatMap((block) => block.panels ?? []) ?? [];
const studioBlocks = studioPanels.flatMap((panel) => panel.blocks ?? []);
const studioApproach = studioBlocks.find((block) => block.id === "studio-approach");

if (studioApproach) {
  const legacyItems = studioApproach.content?.items ?? [];
  const intro = legacyItems[0];

  studioApproach.source = { collection: "approach" };
  studioApproach.content = {
    ...(studioApproach.content ?? {}),
    ...(intro?.title ? { header: { title: intro.title } } : {}),
  };
  delete studioApproach.content.items;
}

await Promise.all([
  writeJson("collections.json", collections),
  writeJson("globalBlocks.json", globalBlocks),
  writeJson("pages.json", pages),
]);

console.log("Canonical content migration complete:");
console.log("  services -> services.json");
console.log("  approach -> approach.json");
console.log("  approach-default -> source: approach");
console.log("  studio-approach -> source: approach");
