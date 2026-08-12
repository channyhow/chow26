import { motion, useReducedMotion } from "motion/react";

import { Media } from "@/components/content/Media";
import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";
import type { MediaItem } from "@/types/media";

export type GalleryLayout = "grid" | "masonry" | "editorial";

export function Gallery({
  items,
  layout = "grid",
}: {
  items: MediaItem[];
  layout?: GalleryLayout;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="gallery"
      data-layout={layout}
      variants={fastStaggerContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      {items.map((item) => (
        <motion.div className="gallery__item" key={item.id} variants={revealItem}>
          <Media media={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
