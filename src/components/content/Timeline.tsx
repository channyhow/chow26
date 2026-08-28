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

function EntryContent({ item }: { item: ContentItem }) {
  const date = getDateLabel(item);

  return (
    <div className="timeline__entry">
      {date ? <p className="timeline__date">{date}</p> : null}
      <TextBlock
        content={{ ...item, eyebrow: undefined }}
        titleAs="h3"
        className="timeline__content"
      />
    </div>
  );
}

export function Timeline({
  items,
  mode = "chronology",
  orientation = "vertical",
  className,
}: TimelineProps) {
  const reduceMotion = useReducedMotion();
  if (!items.length) return null;

  const reveal = {
    initial: !reduceMotion ? { opacity: 0.45, y: 12 } : false,
    whileInView: !reduceMotion ? { opacity: 1, y: 0 } : undefined,
    viewport: { once: true, amount: 0.45 },
  } as const;

  if (orientation === "horizontal") {
    return (
      <div
        className={clsx("timeline", className)}
        data-mode={mode}
        data-orientation="horizontal"
      >
        <HorizontalScroll>
          {items.map((item, index) => (
            <motion.article
              className="timeline__item"
              key={item.id ?? `${item.title ?? "timeline"}-${index}`}
              {...reveal}
            >
              <EntryContent item={item} />
            </motion.article>
          ))}
        </HorizontalScroll>
      </div>
    );
  }

  return (
    <div
      className={clsx("timeline", className)}
      data-mode={mode}
      data-orientation="vertical"
    >
      <ol className="timeline__list">
        {items.map((item, index) => (
          <motion.li
            className="timeline__item"
            key={item.id ?? `${item.title ?? "timeline"}-${index}`}
            {...reveal}
          >
            <EntryContent item={item} />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
