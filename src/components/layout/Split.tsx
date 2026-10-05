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
  primaryMobileColumn?: string;
  secondaryMobileColumn?: string;
  primaryMobileOffset?: string;
  secondaryMobileOffset?: string;
  primaryRole?: SplitRole;
  secondaryRole?: SplitRole;
};

type SplitStyle = CSSProperties & {
  "--split-primary-column"?: string;
  "--split-secondary-column"?: string;
  "--split-primary-mobile-column"?: string;
  "--split-secondary-mobile-column"?: string;
  "--split-primary-mobile-offset"?: string;
  "--split-secondary-mobile-offset"?: string;
};

export function Split({
  primary,
  secondary,
  className,
  variant = "default",
  primaryColumn,
  secondaryColumn,
  primaryMobileColumn,
  secondaryMobileColumn,
  primaryMobileOffset,
  secondaryMobileOffset,
  primaryRole,
  secondaryRole,
}: SplitProps) {
  const style: SplitStyle = {
    ...(primaryColumn ? { "--split-primary-column": primaryColumn } : {}),
    ...(secondaryColumn ? { "--split-secondary-column": secondaryColumn } : {}),
    ...(primaryMobileColumn ? { "--split-primary-mobile-column": primaryMobileColumn } : {}),
    ...(secondaryMobileColumn ? { "--split-secondary-mobile-column": secondaryMobileColumn } : {}),
    ...(primaryMobileOffset ? { "--split-primary-mobile-offset": primaryMobileOffset } : {}),
    ...(secondaryMobileOffset ? { "--split-secondary-mobile-offset": secondaryMobileOffset } : {}),
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
