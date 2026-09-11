import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";

export type ContentSwitcherItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export type ContentSwitcherProps = {
  items: ContentSwitcherItem[];
  variant?: "default" | "detailed";
};

type DetailedStyle = CSSProperties & { "--content-switcher-count": number };

const serviceLabels: Record<string, string> = {
  "service-create": "Créer",
  "service-clarify": "Clarifier",
  "service-evolve": "Faire évoluer",
  "studio-service-create": "Créer",
  "studio-service-clarify": "Clarifier",
  "studio-service-evolve": "Faire évoluer",
};

export function ContentSwitcher({ items, variant = "default" }: ContentSwitcherProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex] ?? items[0];
  const resolvedVariant =
    variant === "default" && items.some((item) => item.id.startsWith("studio-service-"))
      ? "detailed"
      : variant;
  const isDetailed = resolvedVariant === "detailed";
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
  });
  const progress = reduceMotion ? scrollYProgress : springProgress;
  const indicatorX = useTransform(
    progress,
    [0, 1],
    ["0%", `${Math.max(items.length - 1, 0) * 100}%`],
  );

  useMotionValueEvent(progress, "change", (value) => {
    if (!isDetailed || !items.length) return;

    const nextIndex = Math.min(
      items.length - 1,
      Math.floor(Math.min(value, 0.9999) * items.length),
    );
    const next = items[nextIndex];

    if (next && next.id !== activeId) setActiveId(next.id);
  });

  if (!active) return null;

  const scrollToIndex = (index: number) => {
    const item = items[index];
    if (!item) return;

    setActiveId(item.id);

    if (!isDetailed || !rootRef.current || items.length <= 1) return;

    const root = rootRef.current;
    const start = root.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, root.offsetHeight - window.innerHeight);

    window.scrollTo({
      top: start + (range * index) / (items.length - 1),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const selectIndex = (index: number) => {
    scrollToIndex(index);
    requestAnimationFrame(() => {
      const item = items[index];
      if (item) document.getElementById(`content-switcher-tab-${item.id}`)?.focus();
    });
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowLeft":
        nextIndex = (activeIndex - 1 + items.length) % items.length;
        break;
      case "ArrowRight":
        nextIndex = (activeIndex + 1) % items.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectIndex(nextIndex);
  };

  const controls = (
    <div
      className="contentSwitcher__controls"
      role="tablist"
      aria-label={siteData.ui.copy.contentSwitcher.controlsLabel}
    >
      {items.map((item, index) => {
        const selected = item.id === active.id;
        const label = serviceLabels[item.id] ?? item.label;

        return (
          <button
            id={`content-switcher-tab-${item.id}`}
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`content-switcher-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => scrollToIndex(index)}
            onKeyDown={onTabKeyDown}
          >
            {isDetailed ? (
              <>
                <span className="contentSwitcher__index">{String(index + 1).padStart(2, "0")}</span>
                <span>{label}</span>
              </>
            ) : (
              label
            )}
          </button>
        );
      })}
      {isDetailed ? (
        <div className="contentSwitcher__rule" aria-hidden="true">
          <motion.span style={{ x: indicatorX }} />
        </div>
      ) : null}
    </div>
  );

  const viewport = (
    <motion.div className="contentSwitcher__viewport" layout={!reduceMotion && !isDetailed}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          id={`content-switcher-panel-${active.id}`}
          className="contentSwitcher__panel"
          role="tabpanel"
          aria-labelledby={`content-switcher-tab-${active.id}`}
          key={active.id}
          initial={{ opacity: reduceMotion ? 0.97 : 0, y: isDetailed ? (reduceMotion ? 2 : 8) : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: reduceMotion ? 0.97 : 0, y: isDetailed ? (reduceMotion ? -2 : -8) : 0 }}
          transition={{
            duration: reduceMotion ? motionConfig.reduced.duration : motionConfig.duration.default,
            ease: reduceMotion ? motionConfig.easing.standard : motionConfig.easing.standard,
          }}
        >
          {active.content}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  const style = isDetailed
    ? ({ "--content-switcher-count": items.length } as DetailedStyle)
    : undefined;

  return (
    <motion.div
      ref={rootRef}
      className={clsx("contentSwitcher", `contentSwitcher--${resolvedVariant}`)}
      data-variant={resolvedVariant}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      layout={!reduceMotion && !isDetailed}
      style={style}
    >
      {isDetailed ? (
        <div className="contentSwitcher__sticky">
          {controls}
          {viewport}
        </div>
      ) : (
        <>
          {controls}
          {viewport}
        </>
      )}
    </motion.div>
  );
}
