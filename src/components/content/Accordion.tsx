import { motion } from "motion/react";

import { motionConfig, revealContainer, revealItem } from "@/motion/config";

export type AccordionItem = { id: string; title: string; content: string; };

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <motion.div className="accordion" variants={revealContainer} initial="hidden" whileInView="visible" viewport={motionConfig.viewport}>
      {items.map((item) => (
        <motion.details className="accordion__item" key={item.id} variants={revealItem}>
          <summary className="accordion__summary">{item.title}</summary>
          <div className="accordion__content"><div className="accordion__contentInner"><p>{item.content}</p></div></div>
        </motion.details>
      ))}
    </motion.div>
  );
}
