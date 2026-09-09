import collectionsData from "@/data/collections.json";
import globalBlocksData from "@/data/globalBlocks.json";
import type { ContentItem, SectionBlock, SourceRef } from "@/types/content";

const collections = collectionsData as Record<string, ContentItem[]>;
const globalBlocks = globalBlocksData as Record<string, SectionBlock>;

export function resolveBlock(ref: string): SectionBlock | undefined {
  return globalBlocks[ref];
}

export function resolveCollection(source?: SourceRef): ContentItem[] {
  if (!source) return [];

  const list = collections[source.collection] ?? [];
  const query = source.query;
  let result = [...list];

  if (query?.featured !== undefined) {
    result = result.filter((item) => Boolean(item.featured) === query.featured);
  }

  if (query?.category) {
    result = result.filter((item) => item.category === query.category);
  }

  if (query?.group) {
    result = result.filter((item) => item.group === query.group);
  }

  if (query?.enabled !== undefined) {
    result = result.filter((item) => Boolean(item.enabled) === query.enabled);
  }

  if (query?.excludeIds?.length) {
    const excluded = new Set(query.excludeIds);
    result = result.filter((item) => !item.id || !excluded.has(item.id));
  }

  const priority = new Map(
    (query?.prioritizeIds ?? []).map((id, index) => [id, index]),
  );

  result.sort((a, b) => {
    const aPriority = a.id ? priority.get(a.id) : undefined;
    const bPriority = b.id ? priority.get(b.id) : undefined;

    if (aPriority !== undefined || bPriority !== undefined) {
      if (aPriority === undefined) return 1;
      if (bPriority === undefined) return -1;
      return aPriority - bPriority;
    }

    return (a.order ?? 0) - (b.order ?? 0);
  });

  if (query?.limit) {
    result = result.slice(0, query.limit);
  }

  return result;
}
