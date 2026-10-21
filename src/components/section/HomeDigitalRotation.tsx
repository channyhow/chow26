import { useEffect, useState } from "react";
import { Media } from "@/components/content/Media";
import { resolveMedia } from "@/data/resolveMedia";

export function HomeDigitalRotation() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const laptop = resolveMedia("flo-laptop");
  const phone = resolveMedia("flo-mobile");
  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => setActive((value) => 1 - value), 4500);
    return () => window.clearInterval(interval);
  }, [paused]);
  return <div className="homeServicesStory__digitalMedia" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {laptop && <div className="homeServicesStory__rotationFrame" data-active={active === 0}><Media media={laptop} /></div>}
    {phone && <div className="homeServicesStory__rotationFrame" data-active={active === 1}><Media media={phone} /></div>}
  </div>;
}
