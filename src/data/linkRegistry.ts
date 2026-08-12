import linksData from "@/data/links.json";

const registry = linksData as Record<string, Record<string, string>>;

export function getLink(key?: string) {
  if (!key) return undefined;
  const [group, name] = key.split(".");
  return group && name ? registry[group]?.[name] || undefined : undefined;
}
