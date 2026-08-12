import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type ScrollScenePreset = "parallax" | "drift" | "draw";

export type ScrollSceneProps = {
  children: ReactNode;
  preset?: ScrollScenePreset;
  className?: string;
  decorative?: boolean;
  enabled?: boolean;
};

export function ScrollScene({
  children,
  preset = "parallax",
  className,
  decorative = true,
  enabled = true,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const motionEnabled = enabled && !reduceMotion;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const slowY = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const mediumY = useTransform(scrollYProgress, [0, 1], [56, -56]);
  const fastY = useTransform(scrollYProgress, [0, 1], [88, -88]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 10]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const showMovingShapes = preset === "parallax" || preset === "drift";
  const showLine = preset === "draw" || preset === "drift";

  return (
    <div
      ref={ref}
      className={clsx("scrollScene", className)}
      data-preset={preset}
      data-enabled={motionEnabled ? "true" : "false"}
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

      <motion.div
        className="scrollScene__content"
        style={motionEnabled && preset === "parallax" ? { y: contentY } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
