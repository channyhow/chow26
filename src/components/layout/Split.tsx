import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type SplitProps = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
  primaryColumn?: string;
  secondaryColumn?: string;
};

type SplitStyle = CSSProperties & {
  "--split-primary-column"?: string;
  "--split-secondary-column"?: string;
};

export function Split({
  primary,
  secondary,
  className,
  primaryColumn,
  secondaryColumn,
}: SplitProps) {
  const style: SplitStyle = {
    ...(primaryColumn ? { "--split-primary-column": primaryColumn } : {}),
    ...(secondaryColumn ? { "--split-secondary-column": secondaryColumn } : {}),
  };

  return (
    <div className={clsx("split", className)} style={style}>
      <div className="split__primary">{primary}</div>
      <div className="split__secondary">{secondary}</div>
    </div>
  );
}
