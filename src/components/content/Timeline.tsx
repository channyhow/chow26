import { useRef } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem } from "@/types/content";

export type TimelineMode = "chronology" | "checklist";

export type TimelineProps = {
  items: ContentItem[];
  mode?: TimelineMode;
  className?: string;
};

export function Timeline({ items, mode = "chronology", className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 40%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  if (!items.length) return null;

  return (
    <div ref={ref} className={clsx("timeline", className)} data-mode={mode}>
      <div className="timeline__rail" aria-hidden="true">
        <motion.span
          className="timeline__progress"
          style={reduceMotion ? { scaleY: 1 } : { scaleY }}
        />
      </div>

      <ol className="timeline__list">
        {items.map((item, index) => (
          <motion.li
            className="timeline__item"
            key={item.id ?? `${item.title ?? "timeline"}-${index}`}
            initial={reduceMotion ? false : { opacity: 0.35 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.55 }}
          >
            <span className="timeline__marker" aria-hidden="true">
              {mode === "checklist" ? "✓" : String(index + 1).padStart(2, "0")}
            </span>
            <TextBlock content={item} titleAs="h3" className="timeline__content" />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
