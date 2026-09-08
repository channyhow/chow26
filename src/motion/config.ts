import type { Variants } from "motion/react";

export const motionConfig = {
  duration: {
    fast: 0.18,
    default: 0.4,
    slow: 0.64,
  },
  delay: {
    stagger: 0.08,
    staggerFast: 0.06,
  },
  distance: {
    route: 6,
    reveal: 16,
    subtle: 12,
  },
  easing: {
    standard: [0.16, 1, 0.3, 1] as const,
    soft: [0.22, 1, 0.36, 1] as const,
  },
  viewport: {
    once: true,
    amount: 0.14,
    margin: "0px 0px -6% 0px",
  },
} as const;

export const revealTransition = {
  duration: motionConfig.duration.slow,
  ease: motionConfig.easing.soft,
} as const;

export const revealItem: Variants = {
  hidden: {
    opacity: 0.88,
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
