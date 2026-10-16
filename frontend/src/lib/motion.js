/**
 * Shared motion vocabulary.
 *
 * Everything here is deliberately restrained. A single easing curve and a single
 * reveal distance across the whole site reads as one system; a different curve
 * per component reads as nobody decided. Hover feedback changes a border tone
 * rather than lifting the element, because the design system has no shadows and
 * depth comes from surface tone alone.
 *
 * These are plain factory functions, not hooks. A component renders a list of
 * items, so calling a hook per item would break the Rules of Hooks. The caller
 * reads `prefersReducedMotion` once at the top and passes it in, which also
 * makes it impossible for a single element to forget the check.
 */

/** One curve for every transition in the product. */
export const EASE = [0.16, 1, 0.3, 1];

export const DURATION = {
  micro: 0.2,
  reveal: 0.7,
  panel: 0.35,
};

/** How far content travels when it is revealed. */
const REVEAL_Y = 24;

/**
 * Reveal props for one element, keyed to when it scrolls into view.
 *
 * `index` staggers a group of siblings so they cascade in reading order. The
 * stagger is deliberately small: the point is to lead the eye down the page,
 * not to make the reader wait for an animation to finish.
 */
export const reveal = (prefersReducedMotion, index = 0, stagger = 0.06) => {
  if (prefersReducedMotion) {
    return { initial: false, animate: {} };
  }

  return {
    initial: { opacity: 0, y: REVEAL_Y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px -8% 0px" },
    transition: {
      duration: DURATION.reveal,
      delay: index * stagger,
      ease: EASE,
    },
  };
};

/**
 * Parent props that let a group of children cascade together. Children use
 * `revealItem` with no index so they take their delay from this container.
 */
export const revealGroup = (prefersReducedMotion, stagger = 0.06) => {
  if (prefersReducedMotion) {
    return { initial: false, animate: {} };
  }

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-10% 0px -6% 0px" },
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: stagger } },
    },
  };
};

export const revealItem = (prefersReducedMotion) => {
  if (prefersReducedMotion) {
    return { initial: false, animate: {} };
  }

  return {
    variants: {
      hidden: { opacity: 0, y: REVEAL_Y },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.reveal, ease: EASE },
      },
    },
  };
};

/**
 * Page transition. Keyed on the route pathname in PublicLayout, this fades the
 * outgoing page out before the incoming one fades in.
 */
export const pageTransition = (prefersReducedMotion) => {
  if (prefersReducedMotion) {
    return { initial: false, animate: { opacity: 1 } };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: DURATION.panel, ease: EASE },
  };
};

/** Hover feedback for cards. Tone change only, no lift. */
export const cardHover = (prefersReducedMotion) => {
  if (prefersReducedMotion) {
    return { whileHover: {}, whileTap: {} };
  }

  return {
    whileHover: {},
    whileTap: { scale: 0.99 },
    transition: { duration: DURATION.micro, ease: EASE },
  };
};
