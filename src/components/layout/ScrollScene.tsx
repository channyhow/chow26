import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";

import { motionConfig } from "@/motion/config";

export type ScrollScenePreset = "drift" | "parallax" | "ambient" | "draw" | "recede";
export type ScrollSceneDirection = "forward" | "reverse";
export type ScrollSceneRange = "through" | "exit";
export type ScrollSceneIntensity = "quiet" | "default" | "expressive";

export type ScrollSceneProps = {
  children: ReactNode;
  preset?: ScrollScenePreset;
  direction?: ScrollSceneDirection;
  range?: ScrollSceneRange;
  intensity?: ScrollSceneIntensity;
  className?: string;
  decorative?: boolean;
  enabled?: boolean;
  progress?: MotionValue<number>;
};

type LayeredSceneStyle = MotionStyle & {
  "--scene-media-y"?: MotionValue<string>;
  "--scene-media-scale"?: MotionValue<number>;
  "--scene-media-opacity"?: MotionValue<number>;
  "--scene-title-y"?: MotionValue<string>;
  "--scene-title-opacity"?: MotionValue<number>;
  "--scene-title-color"?: MotionValue<string>;
  "--scene-copy-y"?: MotionValue<string>;
  "--scene-copy-opacity"?: MotionValue<number>;
};

const intensityScale: Record<ScrollSceneIntensity, number> = {
  quiet: 0.55,
  default: 1,
  expressive: 1.25,
};

export function ScrollScene({
  children,
  preset = "drift",
  direction = "forward",
  range = "through",
  intensity = "default",
  className,
  decorative = false,
  enabled = true,
  progress,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [responsiveScale, setResponsiveScale] = useState(1);
  const motionEnabled = enabled;
  const sign = direction === "reverse" ? -1 : 1;
  const isAttentionExit = range === "exit" && preset === "drift";
  const reducedScale = reduceMotion ? motionConfig.reduced.sceneScale : 1;
  const attentionScale = isAttentionExit ? 2.35 : 1;
  const scale = responsiveScale * intensityScale[intensity] * reducedScale * attentionScale;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 47.999rem)");
    const updateScale = () => setResponsiveScale(media.matches ? 0.65 : 1);

    updateScale();
    media.addEventListener("change", updateScale);
    return () => media.removeEventListener("change", updateScale);
  }, []);

  const { scrollYProgress: localScrollYProgress } = useScroll({
    target: ref,
    offset: range === "exit"
      ? ["start start", "end start"]
      : ["start end", "end start"],
  });
  const scrollYProgress = progress ?? localScrollYProgress;

  const distance = (value: number) => value * sign * scale;
  const driftY = useTransform(scrollYProgress, [0, 1], [distance(14), distance(-14)]);
  const contentY = useTransform(scrollYProgress, [0, 1], [distance(reduceMotion ? 18 : 48), distance(reduceMotion ? -18 : -48)]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [distance(34), distance(-34)]);
  const ambientX = useTransform(scrollYProgress, [0, 1], [distance(-18), distance(18)]);
  const drawY = useTransform(scrollYProgress, [0, 1], [distance(14), distance(-14)]);
  const recedeY = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, (reduceMotion ? 22 : 64) * scale]);
  const recedeOpacity = useTransform(scrollYProgress, [0, 0.32, 1], [1, 1, reduceMotion ? 0.9 : 0.36]);
  const slowY = useTransform(scrollYProgress, [0, 1], [distance(42), distance(-42)]);
  const mediumY = useTransform(scrollYProgress, [0, 1], [distance(68), distance(-68)]);
  const fastY = useTransform(scrollYProgress, [0, 1], [distance(104), distance(-104)]);
  const rotate = useTransform(scrollYProgress, [0, 1], [distance(-9), distance(11)]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  // Opening exit: the image is a stationary backdrop while the copy rises
  // across it. Only in the final beat, after the copy has crossed the image,
  // does the media itself begin to recede.
  const layeredMediaYNumeric = useTransform(
    scrollYProgress,
    [0, 0.88, 0.96, 1],
    [0, 0, -10 * scale, -24 * scale],
  );
  const layeredMediaY = useTransform(layeredMediaYNumeric, (value) => `${value}px`);
  const layeredMediaScale = useTransform(
    scrollYProgress,
    [0, 0.88, 1],
    [1, 1, reduceMotion ? 1 : 1.008],
  );
  const layeredMediaOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.64, 0.78, 0.92, 1],
    [1, 1, 0.88, 0.52, reduceMotion ? 0.72 : 0.18, reduceMotion ? 0.7 : 0.1],
  );

  const layeredTitleYNumeric = useTransform(
    scrollYProgress,
    [0, 0.3, 0.52, 0.72, 0.9, 1],
    [0, 0, -82 * scale, -188 * scale, -282 * scale, -326 * scale],
  );
  const layeredTitleY = useTransform(layeredTitleYNumeric, (value) => `${value}px`);
  const layeredTitleOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const layeredTitleColor = useTransform(scrollYProgress, [0, 1], ["#222224", "#222224"]);

  const layeredCopyYNumeric = useTransform(
    scrollYProgress,
    [0, 0.3, 0.52, 0.72, 0.9, 1],
    [0, 0, -74 * scale, -174 * scale, -258 * scale, -300 * scale],
  );
  const layeredCopyY = useTransform(layeredCopyYNumeric, (value) => `${value}px`);
  const layeredCopyOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const showMovingShapes = preset === "ambient" && !reduceMotion;
  const showLine = preset === "draw" || preset === "ambient";
  const effectivePreset = reduceMotion && preset === "ambient" ? "drift" : preset;

  let contentStyle: LayeredSceneStyle | undefined;

  if (motionEnabled && isAttentionExit) {
    contentStyle = {
      "--scene-media-y": layeredMediaY,
      "--scene-media-scale": layeredMediaScale,
      "--scene-media-opacity": layeredMediaOpacity,
      "--scene-title-y": layeredTitleY,
      "--scene-title-opacity": layeredTitleOpacity,
      "--scene-title-color": layeredTitleColor,
      "--scene-copy-y": layeredCopyY,
      "--scene-copy-opacity": layeredCopyOpacity,
    };
  } else if (motionEnabled) {
    contentStyle = effectivePreset === "drift"
      ? { y: driftY }
      : effectivePreset === "parallax"
        ? { y: contentY }
        : effectivePreset === "ambient"
          ? { x: ambientX, y: ambientY }
          : effectivePreset === "draw"
            ? { y: drawY }
            : effectivePreset === "recede"
              ? { y: recedeY, opacity: recedeOpacity }
              : undefined;
  }

  return (
    <div
      ref={ref}
      className={clsx("scrollScene", className)}
      data-preset={preset}
      data-direction={direction}
      data-range={range}
      data-intensity={intensity}
      data-enabled={motionEnabled ? "true" : "false"}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      data-attention-exit={isAttentionExit ? "true" : undefined}
      data-progress-source={progress ? "panel" : "self"}
    >
      {decorative ? (
        <div className="scrollScene__decor" aria-hidden="true">
          {showMovingShapes ? (
            <>
              <motion.span className="scrollScene__shape scrollScene__shape--slow" style={motionEnabled ? { y: slowY } : undefined} />
              <motion.span className="scrollScene__shape scrollScene__shape--medium" style={motionEnabled ? { y: mediumY, rotate } : undefined} />
              <motion.span className="scrollScene__shape scrollScene__shape--fast" style={motionEnabled ? { y: fastY } : undefined} />
            </>
          ) : null}
          {showLine ? (
            <motion.span className="scrollScene__line" style={motionEnabled ? { scaleY: lineScale } : { scaleY: 1 }} />
          ) : null}
        </div>
      ) : null}

      <motion.div className="scrollScene__content" style={contentStyle}>
        {children}
      </motion.div>
    </div>
  );
}
