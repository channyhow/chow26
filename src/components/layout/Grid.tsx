import { Children, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";
import type { GridPlacement, GridTrackPlacement } from "@/types/content";
import { responsiveQueries } from "@/utils/responsive";

export type GridProps = {
  children: ReactNode;
  className?: string;
  progressive?: boolean;
  lead?: ReactNode;
  motionPreset?: string;
  placements?: Array<GridPlacement | undefined>;
  motionEnabled?: boolean;
};

type GridRange = {
  initial: number;
  step: number;
};

type GridItemStyle = CSSProperties & Record<`--grid-${string}`, string | number | undefined>;

const gridRanges = {
  mobile: { initial: 4, step: 1 },
  tablet: { initial: 4, step: 2 },
  desktop: { initial: 6, step: 3 },
} satisfies Record<string, GridRange>;

function getGridRange(): GridRange {
  if (typeof window === "undefined") return gridRanges.desktop;
  if (window.matchMedia(responsiveQueries.desktopUp).matches) return gridRanges.desktop;
  if (window.matchMedia(responsiveQueries.tabletUp).matches) return gridRanges.tablet;
  return gridRanges.mobile;
}

function trackValue(track?: GridTrackPlacement) {
  if (!track?.start && !track?.span) return undefined;
  if (track.start && track.span) return `${track.start} / span ${track.span}`;
  if (track.start) return String(track.start);
  return `span ${track.span}`;
}

function rowValue(track?: GridTrackPlacement) {
  if (!track?.row && !track?.rowSpan) return undefined;
  if (track.row && track.rowSpan) return `${track.row} / span ${track.rowSpan}`;
  if (track.row) return String(track.row);
  return `span ${track.rowSpan}`;
}

function placementStyle(placement?: GridPlacement): GridItemStyle | undefined {
  if (!placement) return undefined;

  const style: GridItemStyle = {};
  (["mobile", "tablet", "desktop"] as const).forEach((breakpoint) => {
    const track = placement[breakpoint];
    if (!track) return;

    style[`--grid-column-${breakpoint}`] = trackValue(track);
    style[`--grid-row-${breakpoint}`] = rowValue(track);
    style[`--grid-align-${breakpoint}`] = track.align;
    style[`--grid-justify-${breakpoint}`] = track.justify;
  });

  return style;
}

export function Grid({
  children,
  className,
  progressive = false,
  lead,
  motionPreset,
  placements,
  motionEnabled = true,
}: GridProps) {
  const reduceMotion = useReducedMotion();
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const initialRange = useMemo(() => getGridRange(), []);
  const [range, setRange] = useState<GridRange>(initialRange);
  const [visibleCount, setVisibleCount] = useState(() =>
    progressive ? initialRange.initial : childArray.length,
  );
  const animateGrid = motionEnabled && !reduceMotion;

  useEffect(() => {
    if (!progressive) {
      setVisibleCount(childArray.length);
      return;
    }

    const desktop = window.matchMedia(responsiveQueries.desktopUp);
    const tablet = window.matchMedia(responsiveQueries.tabletUp);

    const syncRange = () => {
      const next = getGridRange();
      setRange(next);
      setVisibleCount((current) => Math.max(next.initial, current));
    };

    syncRange();
    desktop.addEventListener("change", syncRange);
    tablet.addEventListener("change", syncRange);

    return () => {
      desktop.removeEventListener("change", syncRange);
      tablet.removeEventListener("change", syncRange);
    };
  }, [childArray.length, progressive]);

  const visibleChildren = progressive ? childArray.slice(0, visibleCount) : childArray;
  const hasMore = progressive && visibleCount < childArray.length;
  const usesDrawMotion = motionPreset === "draw";
  const usesEditorialPlacement = Boolean(placements?.some(Boolean));

  return (
    <div className="gridReveal">
      <motion.div
        id={progressive ? "project-grid" : undefined}
        className={clsx("grid", lead && "grid--withLead", usesEditorialPlacement && "grid--editorial", className)}
        variants={animateGrid ? fastStaggerContainer : undefined}
        initial={animateGrid ? "hidden" : false}
        whileInView={animateGrid ? "visible" : undefined}
        viewport={animateGrid ? motionConfig.viewport : undefined}
      >
        {lead ? <div className="grid__lead">{lead}</div> : null}
        <AnimatePresence initial={false}>
          {visibleChildren.map((child, index) => {
            const drawOffset = index % 2 === 0 ? -motionConfig.distance.subtle : motionConfig.distance.subtle;

            return (
              <motion.div
                className="grid__item"
                key={(child as { key?: string | null }).key ?? `grid-item-${index}`}
                style={placementStyle(placements?.[index])}
                variants={animateGrid && !usesDrawMotion ? revealItem : undefined}
                initial={animateGrid
                  ? usesDrawMotion
                    ? { opacity: 0, x: drawOffset, y: motionConfig.distance.subtle }
                    : { opacity: 0, y: motionConfig.distance.subtle }
                  : false}
                whileInView={animateGrid && usesDrawMotion ? { opacity: 1, x: 0, y: 0 } : undefined}
                animate={animateGrid && !usesDrawMotion ? { opacity: 1, y: 0 } : undefined}
                viewport={animateGrid && usesDrawMotion ? motionConfig.viewport : undefined}
                transition={animateGrid ? {
                  duration: usesDrawMotion ? motionConfig.duration.slow : motionConfig.duration.default,
                  ease: motionConfig.easing.soft,
                  delay: index * (usesDrawMotion ? 0.08 : 0),
                } : undefined}
              >
                {child}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {hasMore ? (
        <button
          className="gridReveal__more"
          type="button"
          aria-controls="project-grid"
          aria-expanded={visibleCount >= childArray.length}
          onClick={() => setVisibleCount((current) => Math.min(current + range.step, childArray.length))}
        >
          <span>Voir plus</span>
          <span className="gridReveal__moreIcon" aria-hidden="true">↓</span>
        </button>
      ) : null}
    </div>
  );
}
