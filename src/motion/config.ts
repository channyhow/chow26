import type { Variants } from "motion/react";

export const motionConfig = {
  duration: {
    fast: 0.18,
    default: 0.36,
    slow: 0.56,
  },
  delay: {
    stagger: 0.06,
    staggerFast: 0.05,
  },
  distance: {
    route: 4,
    reveal: 8,
    subtle: 8,
  },
  easing: {
    standard: [0.16, 1, 0.3, 1] as const,
    soft: [0.22, 1, 0.36, 1] as const,
  },
  viewport: {
    once: true,
    amount: 0.16,
    margin: "0px 0px -8% 0px",
  },
} as const;

export const revealTransition = {
  duration: motionConfig.duration.slow,
  ease: motionConfig.easing.soft,
} as const;

export const revealItem: Variants = {
  hidden: {
    opacity: 0.94,
    y: motionConfig.distance.reveal,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
};

export const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionConfig.delay.stagger,
      delayChildren: motionConfig.delay.staggerFast,
    },
  },
};

export const fastStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: motionConfig.delay.staggerFast,
      staggerChildren: motionConfig.delay.staggerFast,
    },
  },
};
