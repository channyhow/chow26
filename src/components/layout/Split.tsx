import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export type SplitVariant = "default" | "balanced" | "editorial" | "media-lead";
export type SplitRole = "content" | "media";

export type SplitProps = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
  variant?: SplitVariant;
  primaryColumn?: string;
  secondaryColumn?: string;
  primaryRole?: SplitRole;
  secondaryRole?: SplitRole;
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
  primaryRole,
  secondaryRole,
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
      <div className="split__primary" data-split-role={primaryRole}>{primary}</div>
      <div className="split__secondary" data-split-role={secondaryRole}>{secondary}</div>
    </div>
  );
}
