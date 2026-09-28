import actionsData from "@/data/actions.json";
import type { Action, ActionRef } from "@/types/content";

const actions = actionsData as Record<string, Action>;

export function getAction(ref: ActionRef): Action | undefined {
  return typeof ref === "string" ? actions[ref] : ref;
}

export function resolveActions(refs: ActionRef[] = []): Action[] {
  return refs.map(getAction).filter((action): action is Action => Boolean(action));
}

export function getLink(key?: string) {
  if (!key) return undefined;
  return actions[key]?.href;
}
