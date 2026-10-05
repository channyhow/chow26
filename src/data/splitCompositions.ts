import type { SplitComposition } from "@/types/content";

/**
 * Split composition is opt-in.
 * The mobile artboard composition belongs to HomeOpeningScene only; regular
 * split sections keep the shared responsive flow unless their JSON explicitly
 * provides `splitComposition`.
 */
export function resolveSplitComposition(
  _id: string,
  authored?: SplitComposition,
): SplitComposition | undefined {
  return authored;
}
