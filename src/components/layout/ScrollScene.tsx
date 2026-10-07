import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";

export type ScrollScenePreset = "drift" | "parallax" | "ambient" | "draw" | "recede";
export type ScrollSceneDirection = "forward" | "reverse";
export type ScrollSceneRange = "through" | "exit";
export type ScrollSceneIntensity = "quiet" | "default" | "expressive";
export type ScrollSceneChoreography = "home-opening";

export type ScrollSceneProps = {
  children: ReactNode;
  preset?: ScrollScenePreset;
  direction?: ScrollSceneDirection;
  range?: ScrollSceneRange;
  intensity?: ScrollSceneIntensity;
  choreography?: ScrollSceneChoreography;
  className?: string;
  decorative?: boolean;
  enabled?: boolean;
  progress?: MotionValue<number>;
};

type LayeredSceneStyle = MotionStyle & {
  "--scene-media-x"?: MotionValue<string>;
  "--scene-media-y"?: MotionValue<string>;
  "--scene-media-scale"?: MotionValue<number>;
  "--scene-media-opacity"?: MotionValue<number>;
  "--scene-title-y"?: MotionValue<string>;
  "--scene-title-opacity"?: MotionValue<number>;
  "--scene-title-color"?: MotionValue<string>;
  "--scene-copy-x"?: MotionValue<string>;
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
  choreography,
  className,
  decorative = false,
  enabled = true,
  progress,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [responsiveScale, setResponsiveScale] = useState(1);
  const motionEnabled = enabled;
  const sign = direction === "reverse" ? -1 : 1;
  const isHomeOpening = choreography === "home-opening";
  const attentionScale = isHomeOpening ? 2.35 : 1;
  const scale = responsiveScale * intensityScale[intensity] * attentionScale;

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
  const contentY = useTransform(scrollYProgress, [0, 1], [distance(36), distance(-36)]);
  const ambientY = useTransform(scrollYProgress, [0, 1], [distance(34), distance(-34)]);
  const ambientX = useTransform(scrollYProgress, [0, 1], [distance(-18), distance(18)]);
  const drawY = useTransform(scrollYProgress, [0, 1], [distance(14), distance(-14)]);
  const recedeY = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 64 * scale]);
  const recedeOpacity = useTransform(scrollYProgress, [0, 0.32, 1], [1, 1, 0.36]);
  const slowY = useTransform(scrollYProgress, [0, 1], [distance(42), distance(-42)]);
  const mediumY = useTransform(scrollYProgress, [0, 1], [distance(68), distance(-68)]);
  const fastY = useTransform(scrollYProgress, [0, 1], [distance(104), distance(-104)]);
  const rotate = useTransform(scrollYProgress, [0, 1], [distance(-9), distance(11)]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const layeredMediaXNumeric = useTransform(scrollYProgress, [0, 0.28, 0.62, 1], [0, 0, -20 * scale, -42 * scale]);
  const layeredMediaX = useTransform(layeredMediaXNumeric, (value) => `${value}px`);
  const layeredMediaYNumeric = useTransform(scrollYProgress, [0, 0.28, 0.62, 1], [0, 0, 52 * scale, 104 * scale]);
  const layeredMediaY = useTransform(layeredMediaYNumeric, (value) => `${value}px`);
  const layeredMediaScale = useTransform(scrollYProgress, [0, 0.62, 1], [1, 1, 0.96]);
  const layeredMediaOpacity = useTransform(scrollYProgress, [0, 0.18, 0.34, 0.58, 0.78, 1], [0.62, 0.74, 1, 0.9, 0.46, 0.12]);

  const layeredTitleYNumeric = useTransform(scrollYProgress, [0, 0.24, 0.5, 0.76, 1], [0, 0, -72 * scale, -184 * scale, -292 * scale]);
  const layeredTitleY = useTransform(layeredTitleYNumeric, (value) => `${value}px`);
  const layeredTitleOpacity = useTransform(scrollYProgress, [0, 0.56, 0.78, 1], [1, 1, 0.55, 0]);
  const layeredTitleColor = useTransform(scrollYProgress, [0, 1], ["#222224", "#222224"]);

  const layeredCopyXNumeric = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0, 0, -8 * scale, -18 * scale]);
  const layeredCopyX = useTransform(layeredCopyXNumeric, (value) => `${value}px`);
  const layeredCopyYNumeric = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0, 0, 22 * scale, 42 * scale]);
  const layeredCopyY = useTransform(layeredCopyYNumeric, (value) => `${value}px`);
  const layeredCopyOpacity = useTransform(scrollYProgress, [0, 0.74, 0.92, 1], [1, 1, 0.9, 0.72]);

  const showMovingShapes = preset === "ambient";
  const showLine = preset === "draw" || preset === "ambient";

  let contentStyle: LayeredSceneStyle | undefined;

  if (motionEnabled && isHomeOpening) {
    contentStyle = {
      "--scene-media-x": layeredMediaX,
      "--scene-media-y": layeredMediaY,
      "--scene-media-scale": layeredMediaScale,
      "--scene-media-opacity": layeredMediaOpacity,
      "--scene-title-y": layeredTitleY,
      "--scene-title-opacity": layeredTitleOpacity,
      "--scene-title-color": layeredTitleColor,
      "--scene-copy-x": layeredCopyX,
      "--scene-copy-y": layeredCopyY,
      "--scene-copy-opacity": layeredCopyOpacity,
    };
  } else if (motionEnabled) {
    contentStyle = preset === "drift"
      ? { y: driftY }
      : preset === "parallax"
        ? { y: contentY }
        : preset === "ambient"
          ? { x: ambientX, y: ambientY }
          : preset === "draw"
            ? { y: drawY }
            : preset === "recede"
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
      data-choreography={choreography}
      data-enabled={motionEnabled ? "true" : "false"}
      data-attention-exit={isHomeOpening ? "true" : undefined}
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
          {showLine ? <motion.span className="scrollScene__line" style={motionEnabled ? { scaleY: lineScale } : { scaleY: 1 }} /> : null}
        </div>
      ) : null}

      <motion.div className="scrollScene__content" style={contentStyle}>{children}</motion.div>
    </div>
  );
}
