import { motion } from "motion/react";

import siteData from "@/data/site.json";
import { motionConfig } from "@/motion/config";

export function RouteLoader({ disabled = false }: { disabled?: boolean }) {
  if (disabled) {
    return null;
  }

  const message = siteData.ui.loader.messages[0];

  return (
    <motion.div
      className="loader"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        delay: 0.15,
        duration: motionConfig.duration.fast,
        ease: motionConfig.easing.soft,
      }}
      style={{ pointerEvents: "none" }}
    >
      <span className="loader__mark" />
      <div className="loader__messages">
        <span>{message}</span>
      </div>
    </motion.div>
  );
}
