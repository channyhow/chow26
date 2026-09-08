import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type ScrollScenePreset = "parallax" | "ambient" | "draw";
export type ScrollSceneDirection = "forward" | "reverse";

export type ScrollSceneProps = {
  children: ReactNode;
  preset?: ScrollScenePreset;
  direction?: ScrollSceneDirection;
  className?: string;
  decorative?: boolean;
  enabled?: boolean;
};

export function ScrollScene({
  children,
  preset = "parallax",
  direction = "forward",
  className,
  decorative = false,
  enabled = true,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const motionEnabled = enabled && !reduceMotion;
  const sign = direction === "reverse" ? -1 : 1;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [24 * sign, -24 * sign]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [14 * sign, -14 * sign]);
  const ambientX = useTransform(scrollYProgress, [0, 1], [-8 * sign, 8 * sign]);
  const slowY = useTransform(scrollYProgress, [0, 1], [32 * sign, -32 * sign]);
  const mediumY = useTransform(scrollYProgress, [0, 1], [56 * sign, -56 * sign]);
  const fastY = useTransform(scrollYProgress, [0, 1], [88 * sign, -88 * sign]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8 * sign, 10 * sign]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const showMovingShapes = preset === "ambient";
  const showLine = preset === "draw" || preset === "ambient";
  const contentStyle = motionEnabled
    ? preset === "parallax"
      ? { y: contentY }
      : preset === "ambient"
        ? { x: ambientX, y: ambientY }
        : undefined
    : undefined;

  return (
    <div
      ref={ref}
      className={clsx("scrollScene", className)}
      data-preset={preset}
      data-direction={direction}
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
