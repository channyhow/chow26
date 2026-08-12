import { Children, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "motion/react";

import { fastStaggerContainer, motionConfig, revealItem } from "@/motion/config";

export type GridProps = {
  children: ReactNode;
  className?: string;
};

export function Grid({ children, className }: GridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={clsx("grid", className)}
      variants={fastStaggerContainer}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      {Children.map(children, (child) => (
        <motion.div className="grid__item" variants={revealItem}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
