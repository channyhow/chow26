import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem, TimelineOrientation } from "@/types/content";

export type TimelineMode = "chronology" | "checklist";

export type TimelineProps = {
  items: ContentItem[];
  mode?: TimelineMode;
  orientation?: TimelineOrientation;
  className?: string;
};

function getDateLabel(item: ContentItem) {
  if (typeof item.eyebrow === "string") return item.eyebrow;
  return item.eyebrow?.[0];
}

function TimelineEntry({ item, index, mode }: { item: ContentItem; index: number; mode: TimelineMode }) {
  const reduceMotion = useReducedMotion();
  const date = getDateLabel(item);

  return (
    <motion.article
      className="timeline__item"
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
    </motion.article>
  );
}

export function Timeline({ items, mode = "chronology", orientation = "vertical", className }: TimelineProps) {
  if (!items.length) return null;

  if (orientation === "horizontal") {
    return (
      <div className={clsx("timeline", className)} data-mode={mode} data-orientation="horizontal">
        <HorizontalScroll>
          {items.map((item, index) => (
            <TimelineEntry key={item.id ?? `${item.title ?? "timeline"}-${index}`} item={item} index={index} mode={mode} />
          ))}
        </HorizontalScroll>
      </div>
    );
  }

  return (
    <div className={clsx("timeline", className)} data-mode={mode} data-orientation="vertical">
      <ol className="timeline__list">
        {items.map((item, index) => (
          <li key={item.id ?? `${item.title ?? "timeline"}-${index}`}>
            <TimelineEntry item={item} index={index} mode={mode} />
          </li>
        ))}
      </ol>
    </div>
  );
}
