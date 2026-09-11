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
  reduced: {
    duration: 0.2,
    revealDistance: 4,
    sceneScale: 0.22,
    stagger: 0.03,
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
    opacity: 0.88,
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
    opacity: 0.96,
    y: motionConfig.reduced.revealDistance,
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
      staggerChildren: motionConfig.reduced.stagger,
    },
  },
};
