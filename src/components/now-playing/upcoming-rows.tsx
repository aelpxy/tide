import { AnimatePresence, motion } from "motion/react";
import { fade } from "../../lib/motion";
import type { Song } from "../../lib/subsonic";
import { QueueRow } from "./queue-row";

export function UpcomingRows({ songs, keys, start }: { songs: Song[]; keys: string[]; start: number }) {
  return (
    <AnimatePresence initial={false}>
      {songs.map((song, i) => (
        <motion.div key={keys[i]} layout="position" exit={{ opacity: 0, height: 0 }} transition={fade}>
          <QueueRow song={song} position={start + i} kind="upcoming" />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
