import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem } from "@/types/content";

export type TimelineMode = "chronology" | "checklist";

export type TimelineProps = {
  items: ContentItem[];
  mode?: TimelineMode;
  className?: string;
};

function getDateLabel(item: ContentItem) {
  if (typeof item.eyebrow === "string") return item.eyebrow;
  return item.eyebrow?.[0];
}

export function Timeline({ items, mode = "chronology", className }: TimelineProps) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;

  return (
    <div className={clsx("timeline", className)} data-mode={mode}>
      <ol className="timeline__list">
        {items.map((item, index) => {
          const date = getDateLabel(item);
          return (
            <motion.li
              className="timeline__item"
              key={item.id ?? `${item.title ?? "timeline"}-${index}`}
              initial={!reduceMotion ? { opacity: 0.45, y: 12 } : false}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.45 }}
            >
              <div className="timeline__axis" aria-hidden="true">
                <span className="timeline__marker">
                  {mode === "checklist" ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="timeline__entry">
                {date ? <p className="timeline__date">{date}</p> : null}
                <TextBlock content={{ ...item, eyebrow: undefined }} titleAs="h3" className="timeline__content" />
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
