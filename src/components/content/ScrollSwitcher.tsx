import { Children, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

export type ScrollSwitcherItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export type ScrollSwitcherProps = {
  items: ScrollSwitcherItem[];
  className?: string;
};

type ScrollSwitcherStyle = CSSProperties & { "--scroll-switcher-count": number };

export function ScrollSwitcher({ items, className }: ScrollSwitcherProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const count = items.length;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });
  const endX = `-${Math.max(count - 1, 0) * 100}%`;
  const x = useTransform(progress, [0, 1], ["0%", endX]);
  const indicatorX = useTransform(progress, [0, 1], ["0%", `${Math.max(count - 1, 0) * 100}%`]);

  if (!count) return null;

  const style: ScrollSwitcherStyle = { "--scroll-switcher-count": count };

  return (
    <div ref={ref} className={clsx("scrollSwitcher", className)} style={style}>
      <div className="scrollSwitcher__sticky">
        <div className="scrollSwitcher__controls" aria-label="Choisir un accompagnement">
          {items.map((item, index) => (
            <div className="scrollSwitcher__control" key={item.id}>
              <span className="scrollSwitcher__index">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <motion.span
            className="scrollSwitcher__indicator"
            aria-hidden="true"
            style={!reduceMotion ? { x: indicatorX } : undefined}
          />
        </div>

        <div className="scrollSwitcher__viewport">
          <motion.div
            className="scrollSwitcher__track"
            style={!reduceMotion ? { x } : undefined}
          >
            {Children.toArray(items.map((item) => (
              <article className="scrollSwitcher__item" key={item.id}>
                {item.content}
              </article>
            )))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
