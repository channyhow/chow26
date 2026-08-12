import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export type ScrollProgressMode = "top" | "rail";

export function ScrollProgress({ mode = "top" }: { mode?: ScrollProgressMode | false }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.25,
  });

  if (!mode || reduceMotion) return null;

  return (
    <div className="scrollProgress" data-mode={mode} aria-hidden="true">
      <motion.span
        className="scrollProgress__value"
        style={mode === "rail" ? { scaleY: progress } : { scaleX: progress }}
      />
    </div>
  );
}
