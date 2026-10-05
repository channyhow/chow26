import type { SplitComposition } from "@/types/content";

/**
 * Art-directed split placement stays separate from component styling.
 * Sections can override these values in JSON through `splitComposition`.
 * These presets provide the current Chow Studio compositions while keeping
 * Split itself generic and reusable.
 */
export const splitCompositions: Record<string, SplitComposition> = {
  "studio-service-identity": {
    primaryColumn: "1 / span 5",
    secondaryColumn: "7 / -1",
    primaryMobileColumn: "1 / span 3",
    secondaryMobileColumn: "2 / -1",
    secondaryMobileOffset: "1rem",
  },
  "studio-service-integrations": {
    primaryColumn: "7 / -1",
    secondaryColumn: "1 / span 5",
    primaryMobileColumn: "2 / -1",
    secondaryMobileColumn: "1 / span 3",
    primaryMobileOffset: "1rem",
  },
  "final-cta": {
    primaryColumn: "1 / span 6",
    secondaryColumn: "8 / -1",
    primaryMobileColumn: "1 / span 3",
    secondaryMobileColumn: "2 / -1",
  },
};

export function resolveSplitComposition(id: string, authored?: SplitComposition): SplitComposition | undefined {
  return authored ?? splitCompositions[id];
}
