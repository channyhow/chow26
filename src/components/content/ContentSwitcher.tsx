import { useState, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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

const serviceLabels: Record<string, string> = {
  "service-create": "Je lance mon projet",
  "service-clarify": "Je veux clarifier l’existant",
  "service-evolve": "Je veux le faire évoluer",
  "studio-service-create": "Je lance mon projet",
  "studio-service-clarify": "Je veux clarifier l’existant",
  "studio-service-evolve": "Je veux le faire évoluer",
};

export function ContentSwitcher({ items, variant = "default" }: ContentSwitcherProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex] ?? items[0];
  const resolvedVariant =
    variant === "default" && items.some((item) => item.id.startsWith("studio-service-"))
      ? "detailed"
      : variant;

  if (!active) return null;

  const selectIndex = (index: number) => {
    const item = items[index];

    if (!item) return;

    setActiveId(item.id);
    requestAnimationFrame(() => {
      document.getElementById(`content-switcher-tab-${item.id}`)?.focus();
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

  return (
    <motion.div
      className={clsx("contentSwitcher", `contentSwitcher--${resolvedVariant}`)}
      data-variant={resolvedVariant}
      layout={!reduceMotion}
    >
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
              onClick={() => setActiveId(item.id)}
              onKeyDown={onTabKeyDown}
            >
              {resolvedVariant === "detailed" ? (
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
      </div>

      <motion.div className="contentSwitcher__viewport" layout={!reduceMotion}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            id={`content-switcher-panel-${active.id}`}
            className="contentSwitcher__panel"
            role="tabpanel"
            aria-labelledby={`content-switcher-tab-${active.id}`}
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{
              duration: motionConfig.duration.default,
              ease: motionConfig.easing.standard,
            }}
          >
            {active.content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
