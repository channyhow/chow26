import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  scrollProgress?: MotionValue<number>;
};

export function HomeOpeningScene({ header, media, scrollProgress }: HomeOpeningSceneProps) {
  const openingMedia = media[0];
  const fallbackProgress = useMotionValue(0);
  const progress = scrollProgress ?? fallbackProgress;
  const mediaY1 = useTransform(progress, [0, 1], ["0svh", "-3svh"]);
  const mediaY2 = useTransform(progress, [0, 1], ["0svh", "-6svh"]);
  const mediaY3 = useTransform(progress, [0, 1], ["0svh", "-4svh"]);
  const mediaMotion = [mediaY1, mediaY2, mediaY3];

  return (
    <div className="homeOpeningScene">
      {openingMedia ? (
        <a
          className="homeOpeningScene__mediaLink"
          href="#home-services"
          aria-label="Découvrir les services de Chow Studio"
        >
          <div className="homeOpeningScene__mediaGrid">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`homeOpeningScene__mediaPanel homeOpeningScene__mediaPanel--${index + 1}`}
                style={scrollProgress ? { y: mediaMotion[index] } : undefined}
              >
                <Media
                  media={openingMedia}
                  className="homeOpeningScene__media"
                  sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 31vw, 31vw"
                  ratio="square"
                />
              </motion.div>
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
