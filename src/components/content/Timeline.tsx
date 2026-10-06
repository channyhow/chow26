import clsx from "clsx";
import { motion } from "motion/react";

import { HorizontalScroll } from "@/components/content/HorizontalScroll";
import { TextBlock } from "@/components/content/TextBlock";
import { motionConfig, revealContainer, revealItem } from "@/motion/config";
import type { ContentItem, TimelineOrientation } from "@/types/content";

export type TimelineMode = "chronology" | "checklist";
export type TimelineProps = { items: ContentItem[]; mode?: TimelineMode; orientation?: TimelineOrientation; className?: string; reverse?: boolean; };

function getDateLabel(item: ContentItem) { return typeof item.eyebrow === "string" ? item.eyebrow : item.eyebrow?.[0]; }
function EntryContent({ item }: { item: ContentItem }) {
  const date = getDateLabel(item);
  return <div className="timeline__entry">{date ? <p className="timeline__date">{date}</p> : null}<TextBlock content={{ ...item, eyebrow: undefined }} titleAs="h3" className="timeline__content" /></div>;
}

export function Timeline({ items, mode = "chronology", orientation = "vertical", className, reverse = false }: TimelineProps) {
  if (!items.length) return null;
  if (orientation === "horizontal") {
    return <motion.div className={clsx("timeline", className)} data-mode={mode} data-orientation="horizontal" variants={revealContainer} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
      <HorizontalScroll reverse={reverse}>{items.map((item, index) => <motion.article className="timeline__item" key={item.id ?? `${item.title ?? "timeline"}-${index}`} variants={revealItem}><EntryContent item={item} /></motion.article>)}</HorizontalScroll>
    </motion.div>;
  }
  return <div className={clsx("timeline", className)} data-mode={mode} data-orientation="vertical">
    <motion.ol className="timeline__list" variants={revealContainer} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
      {items.map((item, index) => <motion.li className="timeline__item" key={item.id ?? `${item.title ?? "timeline"}-${index}`} variants={revealItem}><EntryContent item={item} /></motion.li>)}
    </motion.ol>
  </div>;
}
