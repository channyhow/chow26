import type { Variants } from "motion/react";

export const motionConfig = {
  duration: {
    fast: 0.18,
    default: 0.4,
    slow: 0.64,
  },
  delay: {
    stagger: 0.1,
    staggerFast: 0.08,
  },
  distance: {
    route: 6,
    reveal: 24,
    subtle: 12,
  },
  reduced: {
    duration: 0.28,
    revealDistance: 0,
    sceneScale: 0.22,
    stagger: 0.05,
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

export const reducedRevealTransition = {
  duration: motionConfig.reduced.duration,
  ease: motionConfig.easing.standard,
} as const;

export const revealItem: Variants = {
  hidden: {
    opacity: 0,
    y: motionConfig.distance.reveal,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
};

export const reducedRevealItem: Variants = {
  hidden: {
    opacity: 0.65,
    y: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: reducedRevealTransition,
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

export const reducedStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: motionConfig.reduced.stagger,
      staggerChildren: motionConfig.reduced.stagger,
    },
  },
};
