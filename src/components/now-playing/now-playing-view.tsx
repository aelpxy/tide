import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { sheet, slide } from "../../lib/motion";
import { closeNowPlaying, closePanel, useNowPlaying } from "../../stores/now-playing";
import { useCurrentSong } from "../../stores/player";
import { CoverArt } from "../library/cover-art";
import { LyricsPanel } from "./lyrics-panel";
import { NowPlayingTopBar } from "./now-playing-top-bar";
import { PanelHeader } from "./panel-header";
import { QueuePanel } from "./queue-panel";

export function NowPlayingView() {
  const open = useNowPlaying((state) => state.open);
  const panel = useNowPlaying((state) => state.panel);
  const song = useCurrentSong();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && closeNowPlaying();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open && song && (
        <motion.section
          aria-label="Now playing"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={sheet}
          className="absolute inset-x-0 top-0 bottom-22 z-20 flex flex-col overflow-clip bg-[#0b0908]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={song.coverArt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute inset-0"
            >
              <CoverArt id={song.coverArt} size={300} className="size-full scale-150 opacity-40 blur-[120px]" />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-black/40" />

          <NowPlayingTopBar />

          <div className="relative flex min-h-0 flex-1 gap-6 px-8 pb-6">
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={slide}
                  className="aspect-square w-[min(100%,64vh)]"
                >
                  <CoverArt id={song.coverArt} size={1000} className="size-full shadow-2xl shadow-black/60" />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {panel && (
                <motion.aside
                  key={panel}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={slide}
                  className="flex w-95 shrink-0 flex-col overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10 backdrop-blur-xl"
                >
                  {panel === "queue" ? (
                    <QueuePanel onClose={closePanel} />
                  ) : (
                    <>
                      <PanelHeader title="Lyrics" onClose={closePanel} />
                      <LyricsPanel song={song} />
                    </>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
