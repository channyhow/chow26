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
    const body = document.body;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: body.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    };

    // Fix the document in place as well as blocking input: overflow alone
    // doesn't reliably lock touch scrolling or custom scroll containers.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";
    // Some page layouts scroll within an element instead of the window.
    // Snapshot those positions and immediately restore any attempted scroll.
    const scrollPositions = new Map<Element, { top: number; left: number }>();
    for (const element of document.querySelectorAll("*")) {
      if (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1) {
        scrollPositions.set(element, { top: element.scrollTop, left: element.scrollLeft });
      }
    }
    const lockedX = window.scrollX;
    const lockedY = window.scrollY;
    const restoreScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element) {
        const saved = scrollPositions.get(target);
        if (saved) {
          if (target.scrollTop !== saved.top) target.scrollTop = saved.top;
          if (target.scrollLeft !== saved.left) target.scrollLeft = saved.left;
        }
      }
      if (window.scrollX !== lockedX || window.scrollY !== lockedY) {
        window.scrollTo(lockedX, lockedY);
      }
    };
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

    window.addEventListener("scroll", restoreScroll, { passive: true, capture: true });
    window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
    window.addEventListener("keydown", blockScrollKeys, { capture: true });

    return () => {
      window.removeEventListener("scroll", restoreScroll, true);
      window.removeEventListener("wheel", blockScroll, true);
      window.removeEventListener("touchmove", blockScroll, true);
      window.removeEventListener("keydown", blockScrollKeys, true);
      root.style.overflow = previous.rootOverflow;
      body.style.overflow = previous.bodyOverflow;
      root.style.overscrollBehavior = previous.rootOverscroll;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.touchAction = previous.bodyTouchAction;
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
        <motion.div id="home-opening-statement" className="homeOpeningScene__statementReveal" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
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
