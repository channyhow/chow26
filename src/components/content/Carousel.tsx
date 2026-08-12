import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

import siteData from "@/data/site.json";

type Direction = "previous" | "next";

function ArrowIcon({ direction }: { direction: Direction }) {
  return (
    <svg
      className="carousel__arrow"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          direction === "previous"
            ? "M15 5 8 12l7 7"
            : "m9 5 7 7-7 7"
        }
      />
    </svg>
  );
}

export function Carousel({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const count = Children.count(children);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(count > 1);

  const copy = siteData.ui.copy.carousel;
  const carouselLabel = label ?? copy.defaultLabel;

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrevious(track.scrollLeft > 2);
    setCanNext(track.scrollLeft < maxScroll - 2);
  }, []);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * 0.82,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    updateControls();

    return () => observer.disconnect();
  }, [count, updateControls]);

  if (!count) return null;

  return (
    <section className="carousel" aria-label={carouselLabel}>
      <div
        ref={trackRef}
        className="carousel__track"
        role="group"
        aria-roledescription="carrousel"
        aria-label={carouselLabel}
        onScroll={updateControls}
      >
        {Children.map(children, (child, index) => (
          <div
            className="carousel__item"
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${index + 1} ${copy.positionSeparator} ${count}`}
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div
          className="carousel__controls"
          role="group"
          aria-label={copy.navigationLabel}
        >
          <button
            className="carousel__control"
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrevious}
            aria-label={copy.previousLabel ?? "Diapositive précédente"}
          >
            <ArrowIcon direction="previous" />
          </button>

          <button
            className="carousel__control"
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label={copy.nextLabel ?? "Diapositive suivante"}
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      )}
    </section>
  );
}
