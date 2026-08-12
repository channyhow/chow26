import type { ReactNode } from "react";
import clsx from "clsx";

export type SplitProps = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
};

export function Split({ primary, secondary, className }: SplitProps) {
  return (
    <div className={clsx("split", className)}>
      <div className="split__primary">{primary}</div>
      <div className="split__secondary">{secondary}</div>
    </div>
  );
}
