import { useRef, type CSSProperties } from "react";
import clsx from "clsx";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem, TimelineOrientation } from "@/types/content";

export type TimelineMode = "chronology" | "checklist";

export type TimelineProps = {
  items: ContentItem[];
  mode?: TimelineMode;
  orientation?: TimelineOrientation;
  className?: string;
};

export function Timeline({
  items,
  mode = "chronology",
  orientation = "vertical",
  className,
}: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const horizontal = orientation === "horizontal";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: horizontal ? ["start start", "end end"] : ["start 75%", "end 40%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });
  const x = useTransform(
    progress,
    [0, 1],
    ["0vw", `-${Math.max(items.length - 1, 0) * 100}vw`],
  );

  if (!items.length) return null;

  const style = horizontal
    ? ({ "--timeline-count": items.length } as CSSProperties)
    : undefined;

  const list = (
    <motion.ol
      className="timeline__list"
      style={horizontal && !reduceMotion ? { x } : undefined}
    >
      {items.map((item, index) => (
        <motion.li
          className="timeline__item"
          key={item.id ?? `${item.title ?? "timeline"}-${index}`}
          initial={!horizontal && !reduceMotion ? { opacity: 0.35 } : false}
          whileInView={!horizontal && !reduceMotion ? { opacity: 1 } : undefined}
          viewport={!horizontal ? { once: true, amount: 0.55 } : undefined}
        >
          <span className="timeline__marker" aria-hidden="true">
            {mode === "checklist" ? "✓" : String(index + 1).padStart(2, "0")}
          </span>
          <TextBlock content={item} titleAs="h3" className="timeline__content" />
        </motion.li>
      ))}
    </motion.ol>
  );

  return (
    <div
      ref={ref}
      className={clsx("timeline", className)}
      data-mode={mode}
      data-orientation={orientation}
      style={style}
    >
      {horizontal ? (
        <div className="timeline__viewport">{list}</div>
      ) : (
        <>
          <div className="timeline__rail" aria-hidden="true">
            <motion.span
              className="timeline__progress"
              style={reduceMotion ? { scaleY: 1 } : { scaleY: progress }}
            />
          </div>
          {list}
        </>
      )}
    </div>
  );
}
