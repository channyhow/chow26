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

export function HomeOpeningScene({ header, media, parallaxEnabled = false }: HomeOpeningSceneProps) {
  const [expanded, setExpanded] = useState(false);
  const openingMedia = media[0];

  useEffect(() => {
    if (expanded || !openingMedia) return;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [expanded, openingMedia]);

  return (
    <div className="homeOpeningScene" data-expanded={expanded}>
      {openingMedia ? (
        <button
          type="button"
          className="homeOpeningScene__mediaLink"
          aria-expanded={expanded}
          aria-controls="home-opening-statement"
          aria-label={expanded ? "Revenir aux images en plein écran" : "Découvrir le message de Chow Studio"}
          onClick={() => setExpanded((current) => !current)}
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
        <motion.div id="home-opening-statement" className="homeOpeningScene__statementReveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
