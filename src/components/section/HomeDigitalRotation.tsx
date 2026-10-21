import { useEffect, useRef, useState } from "react";
import { Media } from "@/components/content/Media";
import { resolveMedia } from "@/data/resolveMedia";

export function HomeDigitalRotation() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const laptop = resolveMedia("flo-laptop");
  const phone = resolveMedia("flo-mobile");
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !visible) return;
    const interval = window.setInterval(() => setActive((value) => 1 - value), 4500);
    return () => window.clearInterval(interval);
  }, [paused, visible]);
  return <div ref={frameRef} className="homeServicesStory__digitalMedia" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {laptop && <div className="homeServicesStory__rotationFrame" data-active={active === 0}><Media media={laptop} /></div>}
    {phone && <div className="homeServicesStory__rotationFrame" data-active={active === 1}><Media media={phone} /></div>}
  </div>;
}
