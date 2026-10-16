import { EASE, DURATION } from "../../../lib/motion";

// The header runs on the same curve and timings as the rest of the site, so the
// navigation never feels like it belongs to a different product.

export const logoVariants = {
  initial: { opacity: 1 },
  hover: {
    opacity: 0.7,
    transition: { duration: DURATION.micro, ease: EASE },
  },
};

export const menuItemVariants = {
  initial: { y: 0 },
  hover: {
    y: 0,
    transition: { duration: DURATION.micro, ease: EASE },
  },
};

export const dropdownVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.panel, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DURATION.micro, ease: EASE },
  },
};

export const mobileMenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: DURATION.panel, ease: EASE },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: DURATION.panel, ease: EASE },
  },
};

export const mobileItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: DURATION.reveal,
      ease: EASE,
    },
  }),
};

export const languageButtonVariants = {
  initial: { opacity: 1 },
  hover: {
    opacity: 0.75,
    transition: { duration: DURATION.micro, ease: EASE },
  },
  tap: { opacity: 0.6 },
};
