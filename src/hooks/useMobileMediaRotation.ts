import { useEffect, useState } from "react";

/** One autoplay index for responsive media sequences; no carousel dependency. */
export function useMobileMediaRotation(count: number, interval = 4500) {
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 47.99rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(viewport.matches && !reduced.matches);
    update();
    viewport.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      viewport.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || paused || count < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % count), interval);
    return () => window.clearInterval(timer);
  }, [enabled, paused, count, interval]);

  return { active: enabled ? active % Math.max(count, 1) : 0, enabled, setPaused };
}
