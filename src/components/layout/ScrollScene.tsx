import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type ScrollScenePreset = "parallax" | "ambient" | "draw" | "recede";
export type ScrollSceneDirection = "forward" | "reverse";
export type ScrollSceneRange = "through" | "exit";

export type ScrollSceneProps = {
  children: ReactNode;
  preset?: ScrollScenePreset;
  direction?: ScrollSceneDirection;
  range?: ScrollSceneRange;
  className?: string;
  decorative?: boolean;
  enabled?: boolean;
};

export function ScrollScene({
  children,
  preset = "parallax",
  direction = "forward",
  range = "through",
  className,
  decorative = false,
  enabled = true,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [motionScale, setMotionScale] = useState(1);
  const motionEnabled = enabled && !reduceMotion;
  const sign = direction === "reverse" ? -1 : 1;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 47.999rem)");
    const updateScale = () => setMotionScale(media.matches ? 0.65 : 1);

    updateScale();
    media.addEventListener("change", updateScale);
    return () => media.removeEventListener("change", updateScale);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: range === "exit"
      ? ["start start", "end start"]
      : ["start end", "end start"],
  });

  const distance = (value: number) => value * sign * motionScale;
  const contentY = useTransform(scrollYProgress, [0, 1], [distance(48), distance(-48)]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [distance(34), distance(-34)]);
  const ambientX = useTransform(scrollYProgress, [0, 1], [distance(-18), distance(18)]);
  const drawY = useTransform(scrollYProgress, [0, 1], [distance(14), distance(-14)]);
  const recedeY = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0, 56 * motionScale]);
  const recedeOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [1, 1, 0.45]);
  const slowY = useTransform(scrollYProgress, [0, 1], [distance(42), distance(-42)]);
  const mediumY = useTransform(scrollYProgress, [0, 1], [distance(68), distance(-68)]);
  const fastY = useTransform(scrollYProgress, [0, 1], [distance(104), distance(-104)]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [distance(-9), distance(11)],
  );
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const showMovingShapes = preset === "ambient";
  const showLine = preset === "draw" || preset === "ambient";
  const contentStyle = motionEnabled
    ? preset === "parallax"
      ? { y: contentY }
      : preset === "ambient"
        ? { x: ambientX, y: ambientY }
        : preset === "draw"
          ? { y: drawY }
          : preset === "recede"
            ? { y: recedeY, opacity: recedeOpacity }
            : undefined
    : undefined;

  return (
    <div
      ref={ref}
      className={clsx("scrollScene", className)}
      data-preset={preset}
      data-direction={direction}
      data-range={range}
      data-enabled={motionEnabled ? "true" : "false"}
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      {decorative ? (
        <div className="scrollScene__decor" aria-hidden="true">
          {showMovingShapes ? (
            <>
              <motion.span
                className="scrollScene__shape scrollScene__shape--slow"
                style={motionEnabled ? { y: slowY } : undefined}
              />
              <motion.span
                className="scrollScene__shape scrollScene__shape--medium"
                style={motionEnabled ? { y: mediumY, rotate } : undefined}
              />
              <motion.span
                className="scrollScene__shape scrollScene__shape--fast"
                style={motionEnabled ? { y: fastY } : undefined}
              />
            </>
          ) : null}
          {showLine ? (
            <motion.span
              className="scrollScene__line"
              style={motionEnabled ? { scaleY: lineScale } : { scaleY: 1 }}
            />
          ) : null}
        </div>
      ) : null}

      <motion.div className="scrollScene__content" style={contentStyle}>
        {children}
      </motion.div>
    </div>
  );
}
