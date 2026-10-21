import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "motion/react";

export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoRaf: true,
    });

    // The opening owns a deliberate click-to-enter interaction.
    // Stop Lenis itself; native overflow and wheel interception cannot stop
    // a smooth-scroll animation already running.
    const syncOpeningLock = () => {
      if (document.querySelector('.homeOpeningScene[data-expanded="false"]')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    const observer = new MutationObserver(syncOpeningLock);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-expanded"],
    });
    syncOpeningLock();

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, [reduceMotion]);

  return null;
}
