import { motion, useReducedMotion } from "motion/react";

import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";

export function RouteLoader() {
  const reduceMotion = useReducedMotion();
  const messages = siteData.ui.loader.messages;

  return (
    <motion.div
      className="loader"
      role="status"
      aria-live="polite"
      aria-label="Chargement"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduceMotion ? 0 : motionConfig.duration.fast,
        ease: motionConfig.easing.soft,
      }}
    >
      <span className="loader__mark" aria-hidden="true" />
      <div className="loader__messages" aria-hidden="true">
        {messages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </motion.div>
  );
}
