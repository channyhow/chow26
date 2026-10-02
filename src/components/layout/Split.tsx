import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type SplitVariant = "default" | "balanced" | "editorial" | "media-lead";

export type SplitProps = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
  variant?: SplitVariant;
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
  variant = "default",
  primaryColumn,
  secondaryColumn,
}: SplitProps) {
  const style: SplitStyle = {
    ...(primaryColumn ? { "--split-primary-column": primaryColumn } : {}),
    ...(secondaryColumn ? { "--split-secondary-column": secondaryColumn } : {}),
  };

  return (
    <div
      className={clsx("split", `split--${variant}`, className)}
      data-split-variant={variant}
      style={style}
    >
      <div className="split__primary">{primary}</div>
      <div className="split__secondary">{secondary}</div>
    </div>
  );
}
