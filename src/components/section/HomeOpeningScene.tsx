import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

import { useRef } from "react";

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
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end start"] });
  const openingMedia = media[0];
  const progress = scrollYProgress;
  const mediaY1 = useTransform(progress, [0, 1], ["0svh", "-3svh"]);
  const mediaY2 = useTransform(progress, [0, 1], ["0svh", "-6svh"]);
  const mediaY3 = useTransform(progress, [0, 1], ["0svh", "-4svh"]);
  const mediaMotion = [mediaY1, mediaY2, mediaY3];

  return (
    <div ref={sceneRef} className="homeOpeningScene">
      {openingMedia ? (
        <a
          className="homeOpeningScene__mediaLink"
          href="#home-services"
          aria-label="Découvrir les services de Chow Studio"
        >
          <div className="homeOpeningScene__mediaGrid">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`homeOpeningScene__mediaPanel homeOpeningScene__mediaPanel--${index + 1}`}
              >
                <motion.div className="homeOpeningScene__mediaMotion" style={parallaxEnabled && !reduceMotion ? { y: mediaMotion[index] } : undefined}>
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
        </a>
      ) : null}

      {header ? (
        <TextBlock
          content={header}
          titleAs="h1"
          className="homeOpeningScene__statement"
          motionEnabled={false}
        />
      ) : null}
    </div>
  );
}
