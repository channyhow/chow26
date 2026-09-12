import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { TextBlock } from "@/components/content/TextBlock";
import {
  motionConfig,
  reducedRevealItem,
  reducedStaggerContainer,
  revealContainer,
  revealItem,
} from "@/motion/config";
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
  const reduceMotion = Boolean(useReducedMotion());
  if (!items.length) return null;

  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;

  if (orientation === "horizontal") {
    return (
      <motion.div
        className={clsx("timeline", className)}
        data-mode={mode}
        data-orientation="horizontal"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={motionConfig.viewport}
      >
        <HorizontalScroll>
          {items.map((item, index) => (
            <motion.article
              className="timeline__item"
              key={item.id ?? `${item.title ?? "timeline"}-${index}`}
              variants={itemVariants}
            >
              <EntryContent item={item} />
            </motion.article>
          ))}
        </HorizontalScroll>
      </motion.div>
    );
  }

  return (
    <div
      className={clsx("timeline", className)}
      data-mode={mode}
      data-orientation="vertical"
    >
      <motion.ol
        className="timeline__list"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={motionConfig.viewport}
      >
        {items.map((item, index) => (
          <motion.li
            className="timeline__item"
            key={item.id ?? `${item.title ?? "timeline"}-${index}`}
            variants={itemVariants}
          >
            <EntryContent item={item} />
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
