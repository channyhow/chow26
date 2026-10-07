import type { MotionValue } from "motion/react";

import { Media } from "@/components/content/Media";
import { TextBlock } from "@/components/content/TextBlock";
import type { ContentItem } from "@/types/content";
import type { MediaItem } from "@/types/media";

type HomeOpeningSceneProps = {
  header?: ContentItem;
  media: MediaItem[];
  scrollProgress?: MotionValue<number>;
};

export function HomeOpeningScene({ header, media }: HomeOpeningSceneProps) {
  const openingMedia = media[0];

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
              <Media
                key={index}
                media={openingMedia}
                className={`homeOpeningScene__media homeOpeningScene__media--${index + 1}`}
                sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 31vw, 100vw"
                ratio="square"
              />
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
