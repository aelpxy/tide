import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { slide } from "../../lib/motion";
import { closeQueueDrawer, useNowPlaying } from "../../stores/now-playing";
import { useCurrentSong } from "../../stores/player";
import { QueuePanel } from "./queue-panel";

export function QueueDrawer() {
  const drawer = useNowPlaying((state) => state.drawer);
  const song = useCurrentSong();

  useEffect(() => {
    if (!drawer) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeQueueDrawer();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawer]);

  return (
    <AnimatePresence>
      {drawer && song && (
        <motion.aside
          aria-label="Play queue"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={slide}
          className="absolute top-17 right-3 bottom-25 z-30 flex w-95 flex-col overflow-clip rounded-xl bg-elevated/90 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
        >
          <QueuePanel onClose={closeQueueDrawer} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
