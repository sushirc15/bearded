import { Variants } from "framer-motion";

export const EASE_BEZIER: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: EASE_BEZIER,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const childRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: EASE_BEZIER,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const cardHoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.25, ease: EASE_BEZIER },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_BEZIER,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};
