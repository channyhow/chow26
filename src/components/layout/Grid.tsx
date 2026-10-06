import { Children, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  fastStaggerContainer,
  motionConfig,
  revealItem,
} from "@/motion/config";
import type { GridPlacement, GridTrackPlacement } from "@/types/content";
import { responsiveQueries } from "@/utils/responsive";

export type GridProps = {
  children: ReactNode;
  className?: string;
  progressive?: boolean;
  lead?: ReactNode;
  motionPreset?: string;
  placements?: Array<GridPlacement | undefined>;
  motionEnabled?: boolean;
  scrollLinked?: boolean;
};

type GridRange = {
  initial: number;
  step: number;
};

type GridItemStyle = CSSProperties & Record<`--grid-${string}`, string | number | undefined>;

type GridMotionItemProps = {
  child: ReactNode;
  index: number;
  placement?: GridPlacement;
  animateGrid: boolean;
  usesDrawMotion: boolean;
  scrollLinked: boolean;
  progress: MotionValue<number>;
  itemVariants: typeof revealItem;
};

const gridRanges = {
  mobile: { initial: 6, step: 2 },
  tablet: { initial: 6, step: 2 },
  desktop: { initial: 6, step: 3 },
} satisfies Record<string, GridRange>;

function getGridRange(): GridRange {
  if (typeof window === "undefined") return gridRanges.desktop;
  if (window.matchMedia(responsiveQueries.desktopUp).matches) return gridRanges.desktop;
  if (window.matchMedia(responsiveQueries.tabletUp).matches) return gridRanges.tablet;
  return gridRanges.mobile;
}

function trackValue(track?: GridTrackPlacement) {
  if (!track?.start && !track?.span) return undefined;
  if (track.start && track.span) return `${track.start} / span ${track.span}`;
  if (track.start) return String(track.start);
  return `span ${track.span}`;
}

function rowValue(track?: GridTrackPlacement) {
  if (!track?.row && !track?.rowSpan) return undefined;
  if (track.row && track.rowSpan) return `${track.row} / span ${track.rowSpan}`;
  if (track.row) return String(track.row);
  return `span ${track.rowSpan}`;
}

function placementStyle(placement?: GridPlacement): GridItemStyle | undefined {
  if (!placement) return undefined;

  const style: GridItemStyle = {};
  (["mobile", "tablet", "desktop"] as const).forEach((breakpoint) => {
    const track = placement[breakpoint];
    if (!track) return;

    style[`--grid-column-${breakpoint}`] = trackValue(track);
    style[`--grid-row-${breakpoint}`] = rowValue(track);
    style[`--grid-align-${breakpoint}`] = track.align;
    style[`--grid-justify-${breakpoint}`] = track.justify;
  });

  return style;
}

function GridMotionItem({
  child,
  index,
  placement,
  animateGrid,
  usesDrawMotion,
  scrollLinked,
  progress,
  itemVariants,
}: GridMotionItemProps) {
  const baseOffset = motionConfig.distance.subtle;
  const drawOffset = index % 2 === 0 ? -baseOffset : baseOffset;
  const staggerOffset = Math.min(index * 0.045, 0.27);
  const entryStart = 0.02 + staggerOffset;
  const entryEnd = Math.min(entryStart + 0.12, 0.46);
  const exitStart = Math.max(entryEnd + 0.18, 0.86);
  const linkedY = useTransform(progress, [entryStart, entryEnd, exitStart, 1], [baseOffset * 0.55, 0, 0, -baseOffset]);
  const linkedOpacity = useTransform(progress, [entryStart, entryEnd, exitStart, 1], [0.42, 1, 1, 0.98]);
  const linkedStyle = scrollLinked
    ? { ...placementStyle(placement), y: linkedY, opacity: linkedOpacity }
    : placementStyle(placement);

  return (
    <motion.div
      className="grid__item"
      key={(child as { key?: string | null }).key ?? `grid-item-${index}`}
      style={linkedStyle}
      variants={animateGrid && !usesDrawMotion && !scrollLinked ? itemVariants : undefined}
      initial={animateGrid && usesDrawMotion && !scrollLinked
        ? { opacity: 0, x: drawOffset, y: baseOffset }
        : undefined}
      whileInView={animateGrid && usesDrawMotion && !scrollLinked ? { opacity: 1, x: 0, y: 0 } : undefined}
      viewport={animateGrid && usesDrawMotion && !scrollLinked ? motionConfig.viewport : undefined}
      transition={animateGrid && usesDrawMotion && !scrollLinked ? {
        duration: motionConfig.duration.slow,
        ease: motionConfig.easing.soft,
        delay: index * motionConfig.delay.staggerFast,
      } : undefined}
    >
      {child}
    </motion.div>
  );
}

export function Grid({
  children,
  className,
  progressive = false,
  lead,
  motionPreset,
  placements,
  motionEnabled = true,
  scrollLinked = false,
}: GridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const progressiveGrid = progressive || childArray.length > gridRanges.desktop.initial;
  const initialRange = useMemo(() => getGridRange(), []);
  const [range, setRange] = useState<GridRange>(initialRange);
  const [visibleCount, setVisibleCount] = useState(() => initialRange.initial);
  const animateGrid = motionEnabled;
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start 94%", "end 14%"],
  });

  useEffect(() => {
    if (!progressiveGrid) return;

    const desktop = window.matchMedia(responsiveQueries.desktopUp);
    const tablet = window.matchMedia(responsiveQueries.tabletUp);

    const syncRange = () => {
      const next = getGridRange();
      setRange(next);
      setVisibleCount((current) => Math.max(next.initial, current));
    };

    desktop.addEventListener("change", syncRange);
    tablet.addEventListener("change", syncRange);

    return () => {
      desktop.removeEventListener("change", syncRange);
      tablet.removeEventListener("change", syncRange);
    };
  }, [progressiveGrid]);

  const effectiveVisibleCount = progressiveGrid ? visibleCount : childArray.length;
  const visibleChildren = progressiveGrid ? childArray.slice(0, effectiveVisibleCount) : childArray;
  const hasMore = progressiveGrid && effectiveVisibleCount < childArray.length;
  const usesDrawMotion = motionPreset === "draw";
  const usesEditorialPlacement = Boolean(placements?.some(Boolean));
  const usesScrollLinkedMotion = animateGrid && scrollLinked;

  return (
    <div className="gridReveal" ref={scrollRef} data-scroll-linked={usesScrollLinkedMotion ? "true" : undefined}>
      <motion.div
        id={progressiveGrid ? "project-grid" : undefined}
        className={clsx("grid", lead && "grid--withLead", usesEditorialPlacement && "grid--editorial", className)}
        variants={animateGrid && !usesScrollLinkedMotion ? fastStaggerContainer : undefined}
        initial={animateGrid && !usesScrollLinkedMotion ? "hidden" : false}
        whileInView={animateGrid && !usesScrollLinkedMotion ? "visible" : undefined}
        viewport={animateGrid && !usesScrollLinkedMotion ? motionConfig.viewport : undefined}
      >
        {lead ? <div className="grid__lead">{lead}</div> : null}
        <AnimatePresence initial={false}>
          {visibleChildren.map((child, index) => (
            <GridMotionItem
              key={(child as { key?: string | null }).key ?? `grid-item-${index}`}
              child={child}
              index={index}
              placement={placements?.[index]}
              animateGrid={animateGrid}
              usesDrawMotion={usesDrawMotion}
              scrollLinked={usesScrollLinkedMotion}
              progress={scrollYProgress}
              itemVariants={revealItem}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore ? (
        <button
          className="gridReveal__more"
          type="button"
          aria-controls="project-grid"
          aria-expanded={effectiveVisibleCount >= childArray.length}
          onClick={() => setVisibleCount((current) => Math.min(current + range.step, childArray.length))}
        >
          <span>Voir plus</span>
          <span className="gridReveal__moreIcon" aria-hidden="true">↓</span>
        </button>
      ) : null}
    </div>
  );
}
