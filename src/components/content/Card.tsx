import clsx from "clsx";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import type { CardEffect, CardVariant, ContentSurface } from "@/types/content";

export type CardProps = {
  children: ReactNode;
  href?: string;
  label?: string;
  frame?: boolean;
  effect?: CardEffect;
  className?: string;
  variant?: CardVariant;
  surface?: ContentSurface;
};

export function Card({
  children,
  href,
  label,
  frame = false,
  effect = "none",
  className,
  variant = "default",
  surface,
}: CardProps) {
  const cardClassName = clsx(
    "card",
    variant !== "default" && `card--${variant}`,
    frame && "frame",
    effect === "glass" && "effectGlass",
    effect === "grain" && "effectGrain",
    className,
  );

  if (href) {
    return (
      <Link
        className={cardClassName}
        to={href}
        aria-label={label ? `Consulter : ${label}` : "Consulter"}
        data-surface={surface}
      >
        {children}
      </Link>
    );
  }

  return <article className={cardClassName} data-surface={surface}>{children}</article>;
}
