import type { CSSProperties, ReactNode } from "react";

export type EditorialArea = "title" | "media" | "description" | "offers" | "navigation" | "heading" | "deliverables" | "price" | "action";
export type EditorialSpan = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
export type EditorialStart = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EditorialPreset = "full" | "left" | "right";

const editorialPresets: Record<EditorialPreset, EditorialPlacement> = {
  full: { start: 1, span: 12 },
  left: { start: 1, span: 5 },
  right: { start: 7, span: 5 },
};

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
  preset?: EditorialPreset;
  children: ReactNode;
  className?: string;
}

export function EditorialGridItem({
  area,
  placement,
  preset,
  children,
  className = "",
}: EditorialGridItemProps) {
  const resolvedPlacement = placement ?? (preset ? editorialPresets[preset] : editorialPresets.full);
  const style = {
    "--editorial-start": resolvedPlacement.start ?? 1,
    "--editorial-span": resolvedPlacement.span ?? 12,
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
