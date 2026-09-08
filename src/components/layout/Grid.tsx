import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";

export type GridProps = {
  children: ReactNode;
  className?: string;
  progressive?: boolean;
};

type GridRange = {
  initial: number;
  step: number;
};

function getGridRange(): GridRange {
  if (typeof window === "undefined") return { initial: 6, step: 3 };
  if (window.matchMedia("(min-width: 64rem)").matches) return { initial: 6, step: 3 };
  if (window.matchMedia("(min-width: 48rem)").matches) return { initial: 4, step: 2 };
  return { initial: 4, step: 1 };
}

export function Grid({ children, className, progressive = false }: GridProps) {
  const reduceMotion = useReducedMotion();
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const [range, setRange] = useState<GridRange>(() => getGridRange());
  const [visibleCount, setVisibleCount] = useState(() => progressive ? getGridRange().initial : childArray.length);

  useEffect(() => {
    if (!progressive) {
      setVisibleCount(childArray.length);
      return;
    }

    const desktop = window.matchMedia("(min-width: 64rem)");
    const tablet = window.matchMedia("(min-width: 48rem)");

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
