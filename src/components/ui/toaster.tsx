import { AnimatePresence, motion } from "motion/react";
import { fade } from "../../lib/motion";
import { useToast } from "../../stores/toast";

export function Toaster() {
  const { message, id } = useToast();

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-26 z-50 flex justify-center">
      <AnimatePresence>
        {message && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={fade}
            className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black shadow-2xl"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
