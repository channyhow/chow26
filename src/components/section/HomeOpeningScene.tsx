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

  useEffect(() => {
    if (expanded || !openingMedia) return;
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
    };

    // Fix the document in place as well as blocking input: overflow alone
    // doesn't reliably lock touch scrolling or custom scroll containers.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const blockScroll = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };
    const blockScrollKeys = (event: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key) &&
        !(event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true']"))
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
    window.addEventListener("keydown", blockScrollKeys, { capture: true });

    return () => {
      window.removeEventListener("wheel", blockScroll, true);
      window.removeEventListener("touchmove", blockScroll, true);
      window.removeEventListener("keydown", blockScrollKeys, true);
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
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
