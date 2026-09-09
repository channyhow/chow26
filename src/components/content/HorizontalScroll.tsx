import { Children, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

type HorizontalScrollStyle = CSSProperties & { "--horizontal-scroll-count": number };

export type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  labels?: string[];
};

export function HorizontalScroll({ children, className, labels }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const count = Children.count(children);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const endX = `-${Math.max(count - 1, 0) * 100}vw`;
  const x = useTransform(progress, [0, 0.06, 0.88, 1], ["0vw", "0vw", endX, endX]);
  const indicatorX = useTransform(progress, [0, 1], ["0%", `${Math.max(count - 1, 0) * 100}%`]);

  if (!count) return null;

  const style: HorizontalScrollStyle = { "--horizontal-scroll-count": count };

  return (
    <div ref={ref} className={clsx("horizontalScroll", className)} style={style}>
      <div className="horizontalScroll__viewport">
        {labels?.length === count ? (
          <div className="horizontalScroll__progress" aria-hidden="true">
            <div className="horizontalScroll__labels">
              {labels.map((label, index) => (
                <span key={`${label}-${index}`}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {label}
                </span>
              ))}
            </div>
            <div className="horizontalScroll__rule">
              <motion.span style={!reduceMotion ? { x: indicatorX } : undefined} />
            </div>
          </div>
        ) : null}

        <motion.div className="horizontalScroll__track" style={!reduceMotion ? { x } : undefined}>
          {Children.map(children, (child) => (
            <div className="horizontalScroll__item">{child}</div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
