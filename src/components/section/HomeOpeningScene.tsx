import { motion } from "motion/react";

import { useEffect, useState } from "react";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  parallaxEnabled?: boolean;
};

export function HomeOpeningScene({ header, media }: HomeOpeningSceneProps) {
  const [expanded, setExpanded] = useState(false);
  const openingMedia = media[0];

  // The opening is intentionally gated until tapped. CSS owns that initial
  // state; avoid global touch/wheel listeners, which can strand mobile scrolling.
  useEffect(() => {
    if (!expanded) return;
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  }, [expanded]);

  return (
    <div className="homeOpeningScene" data-expanded={expanded}>
      {openingMedia ? (
        <button
          type="button"
          className="homeOpeningScene__mediaLink"
          aria-expanded={expanded}
          aria-controls="home-opening-statement"
          aria-label="Découvrir le message de Chow Studio"
          onClick={() => setExpanded(true)}
        >
          <div className="homeOpeningScene__mediaStage">
            <Media
              media={openingMedia}
              className="homeOpeningScene__media"
              sizes="100vw"
              ratio="square"
            />
            <div className="homeOpeningScene__mediaGrid" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index} className="homeOpeningScene__mediaPanel" />
              ))}
            </div>
          </div>
        </button>
      ) : null}

      {header && expanded ? (
        <motion.div id="home-opening-statement" className="homeOpeningScene__statementReveal" initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ opacity: { duration: 1.1, delay: 1.35, ease: [0.22, 1, 0.36, 1] }, y: { type: "spring", stiffness: 75, damping: 22, mass: 1.3, delay: 1.35 } }}>
        <TextBlock
          content={header}
          titleAs="h1"
          copyVariant="prominent"
          titleVariant="display"
          className="homeOpeningScene__statement"
          motionEnabled={false}
        />
        </motion.div>
      ) : null}
    </div>
  );
}
