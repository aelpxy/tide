import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { fade } from "../../lib/motion";

export function Reveal({ show, className, children }: { show: boolean; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          className={`whitespace-nowrap ${className ?? ""}`}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
