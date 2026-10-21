import { motion, useScroll, useTransform } from "motion/react";

import { useRef, useState } from "react";

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end start"] });
  const openingMedia = media[0];
  const progress = scrollYProgress;
  const mediaY1 = useTransform(progress, [0, 1], ["0svh", "-3svh"]);
  const mediaY2 = useTransform(progress, [0, 1], ["0svh", "-6svh"]);
  const mediaY3 = useTransform(progress, [0, 1], ["0svh", "-4svh"]);
  const mediaMotion = [mediaY1, mediaY2, mediaY3];

  return (
    <div ref={sceneRef} className="homeOpeningScene" data-expanded={expanded}>
      {openingMedia ? (
        <button
          type="button"
          className="homeOpeningScene__mediaLink"
          aria-expanded={expanded}
          aria-controls={expanded ? "home-opening-statement" : undefined}
          aria-label={expanded ? "Revenir aux images en plein écran" : "Découvrir le message de Chow Studio"}
          onClick={() => setExpanded((current) => !current)}
        >
          <div className="homeOpeningScene__mediaGrid">
            {Array.from({ length: 12 }, (_, index) => index).map((index) => (
              <div
                key={index}
                className="homeOpeningScene__mediaPanel"
              >
                <motion.div className="homeOpeningScene__mediaMotion" style={parallaxEnabled ? { y: mediaMotion[index % mediaMotion.length] } : undefined}>
                <Media
                  media={openingMedia}
                  className="homeOpeningScene__media"
                  sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 31vw, 31vw"
                  ratio="square"
                />
                </motion.div>
              </div>
            ))}
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
