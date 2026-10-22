import { useState } from "react";

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

  return (
    <div className="homeOpeningScene" data-expanded={expanded}>
      {openingMedia ? (
        <button
          type="button"
          className="homeOpeningScene__mediaLink"
          aria-expanded={expanded}
          aria-controls="home-opening-statement"
          aria-label="Découvrir le message de Chow Studio"
          disabled={expanded}
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

      {header ? (
        <div id="home-opening-statement" className="homeOpeningScene__statementReveal">
          <TextBlock
          content={header}
          titleAs="h1"
          copyVariant="prominent"
          titleVariant="display"
          className="homeOpeningScene__statement"
          motionEnabled={false}
          />
        </div>
      ) : null}
    </div>
  );
}
