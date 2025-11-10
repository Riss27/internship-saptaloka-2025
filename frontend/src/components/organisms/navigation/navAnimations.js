export const logoVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.5 },
  },
};

export const menuItemVariants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
};

export const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
};

export const mobileItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 },
  }),
};

export const languageButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 },
};
