import type { ReactNode } from "react";

/**
 * Legacy system-preview wrapper.
 * Live page panel behavior is owned by SectionGroup; keep this only so the
 * internal /system inventory can render its historical ScrollPanel example.
 */
export function ScrollPanel({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  return (
    <div className="scrollPanel" data-enabled={enabled || undefined}>
      {children}
    </div>
  );
}
