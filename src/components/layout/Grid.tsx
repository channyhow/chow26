import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";
import { responsiveQueries } from "@/utils/responsive";

export type GridProps = {
  children: ReactNode;
  className?: string;
  progressive?: boolean;
};

type GridRange = {
  initial: number;
  step: number;
};

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

export function Grid({ children, className, progressive = false }: GridProps) {
  const reduceMotion = useReducedMotion();
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const initialRange = useMemo(() => getGridRange(), []);
  const [range, setRange] = useState<GridRange>(initialRange);
  const [visibleCount, setVisibleCount] = useState(() =>
    progressive ? initialRange.initial : childArray.length,
  );

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

  return (
    <div className={clsx("gridReveal", progressive && "gridReveal--progressive")}>
      <motion.div
        id={progressive ? "project-grid" : undefined}
        className={clsx("grid", className)}
        variants={fastStaggerContainer}
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={motionConfig.viewport}
      >
        <AnimatePresence initial={false}>
          {visibleChildren.map((child, index) => (
            <motion.div
              className="grid__item"
              key={(child as { key?: string | null }).key ?? `grid-item-${index}`}
              variants={revealItem}
              initial={reduceMotion ? false : { opacity: 0, y: motionConfig.distance.subtle }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: motionConfig.duration.default, ease: motionConfig.easing.soft }}
            >
              {child}
            </motion.div>
          ))}
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
