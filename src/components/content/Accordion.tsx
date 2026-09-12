import { motion, useReducedMotion } from "motion/react";

import {
  motionConfig,
  reducedRevealItem,
  reducedStaggerContainer,
  revealContainer,
  revealItem,
} from "@/motion/config";

export type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const reduceMotion = Boolean(useReducedMotion());
  const containerVariants = reduceMotion ? reducedStaggerContainer : revealContainer;
  const itemVariants = reduceMotion ? reducedRevealItem : revealItem;

  return (
    <motion.div
      className="accordion"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      {items.map((item) => (
        <motion.details className="accordion__item" key={item.id} variants={itemVariants}>
          <summary className="accordion__summary">{item.title}</summary>
          <div className="accordion__content">
            <div className="accordion__contentInner"><p>{item.content}</p></div>
          </div>
        </motion.details>
      ))}
    </motion.div>
  );
}
