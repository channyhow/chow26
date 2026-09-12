import { motion, useReducedMotion } from "motion/react";

import { Media } from "@/components/content/Media";
import {
  fastStaggerContainer,
  motionConfig,
  reducedRevealItem,
  reducedStaggerContainer,
  revealItem,
} from "@/motion/config";
import type { MediaItem } from "@/types/media";

export type GalleryLayout = "grid" | "masonry" | "editorial";

const getMediaOrientation = (item: MediaItem) => {
  if (!item.width || !item.height) return undefined;
  if (item.width === item.height) return "square";
  return item.width > item.height ? "landscape" : "portrait";
};

export function Gallery({
  items,
  layout = "grid",
}: {
  items: MediaItem[];
  layout?: GalleryLayout;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const containerVariants = reduceMotion ? reducedStaggerContainer : fastStaggerContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;

  return (
    <motion.div
      className="gallery"
      data-layout={layout}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      {items.map((item) => (
        <motion.div
          className="gallery__item"
          key={item.id}
          variants={itemVariants}
          data-media-type={item.type}
          data-orientation={getMediaOrientation(item)}
        >
          <Media media={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
