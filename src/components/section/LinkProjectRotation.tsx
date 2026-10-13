import { useEffect, useState } from "react";

import { Media } from "@/components/content/Media";
import { resolveMediaList } from "@/data/resolveMedia";

const frames = resolveMediaList(["flo-logo", "flo-wordmark", "flo-business-card", "flo-mobile1"]);
const intervalMs = 3500;

export function LinkProjectRotation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const sync = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (reducedMotion.matches || document.hidden) {
        setActive(0);
        return;
      }
      timer = window.setInterval(() => {
        setActive((index) => (index + 1) % frames.length);
      }, intervalMs);
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <div className="linkPage__rotation" aria-hidden="true">
    {frames.map((frame, index) => (
      <div className="linkPage__rotationFrame" key={frame.id} data-active={index === active}>
        <Media media={frame} priority={index === 0} sizes="(min-width: 64rem) 32vw, 90vw" />
      </div>
    ))}
  </div>;
}
