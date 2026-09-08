import { motion, useReducedMotion } from "motion/react";

import { Media } from "@/components/content/Media";
import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";
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
        <motion.div
          className="gallery__item"
          key={item.id}
          variants={revealItem}
          data-media-type={item.type}
          data-orientation={getMediaOrientation(item)}
        >
          <Media media={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
