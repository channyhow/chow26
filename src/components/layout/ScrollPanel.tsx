import type { ReactNode } from "react";

export function ScrollPanel({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  return (
    <div className="scrollPanel" data-enabled={enabled || undefined}>
      {children}
    </div>
  );
}
