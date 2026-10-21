import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Media } from "@/components/content/Media";
import type { MediaItem } from "@/types/media";

type MediaRotationProps = {
  items: MediaItem[];
  className?: string;
  interval?: number;
  sizes?: string;
};

export function MediaRotation({ items, className, interval = 4500, sizes = "100vw" }: MediaRotationProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || items.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % items.length), interval);
    return () => window.clearInterval(timer);
  }, [paused, visible, items.length, interval]);

  if (!items.length) return null;
  return (
    <figure
      ref={ref}
      className={clsx("mediaRotation", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mediaRotation__stage">
        {items.map((item, index) => (
          <div key={item.id} className="mediaRotation__slide" data-active={active === index} aria-hidden={active !== index}>
            <Media media={item} sizes={sizes} />
          </div>
        ))}
      </div>
    </figure>
  );
}
