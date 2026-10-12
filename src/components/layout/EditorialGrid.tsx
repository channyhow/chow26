import type { CSSProperties, ReactNode } from "react";

export type EditorialArea = "title" | "media" | "description" | "offers" | "navigation" | "heading" | "deliverables" | "price" | "action";
export type EditorialSpan = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
export type EditorialStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface EditorialPlacement {
  start?: EditorialStart;
  span?: EditorialSpan;
}

export interface EditorialGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * One semantic grid; the DOM order remains the reading and tab order.
 * Grid items own placement; motion wrappers stay inside each item.
 */
export function EditorialGrid({ children, className = "" }: EditorialGridProps) {
  return <div className={["editorialGrid", className].filter(Boolean).join(" ")}>{children}</div>;
}

export interface EditorialGridItemProps {
  area: EditorialArea;
  placement?: EditorialPlacement;
  children: ReactNode;
  className?: string;
}

export function EditorialGridItem({
  area,
  placement,
  children,
  className = "",
}: EditorialGridItemProps) {
  const style = {
    "--editorial-start": placement?.start ?? 1,
    "--editorial-span": placement?.span ?? 12,
  } as CSSProperties;

  return (
    <div
      className={["editorialGrid__item", className].filter(Boolean).join(" ")}
      data-editorial-area={area}
      style={style}
    >
      {children}
    </div>
  );
}
