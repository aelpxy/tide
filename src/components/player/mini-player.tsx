import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize2, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { exitMiniPlayer } from "../../lib/mini-player";
import { useCurrentSong, usePlayer } from "../../stores/player";
import { CoverArt } from "../library/cover-art";
import logo from "../../../logo.svg";

export function MiniPlayer() {
  const song = useCurrentSong();
  const playing = usePlayer((state) => state.playing);
  const time = usePlayer((state) => state.time);
  const duration = usePlayer((state) => state.duration);
  const { toggle, next, previous } = usePlayer.getState();
  const PlayIcon = playing ? Pause : Play;

  const control =
    "flex items-center justify-center text-neutral-300 transition-[color,scale] duration-150 ease-out hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-40";
  const corner =
    "flex size-7 items-center justify-center rounded-full text-neutral-400 transition-[color,background-color] duration-150 hover:bg-white/10 hover:text-white";

  return (
    <div
      data-tauri-drag-region
      className="relative flex h-screen items-center gap-4 overflow-clip bg-black pr-4 text-white"
    >
      {song && (
        <CoverArt
          id={song.coverArt}
          size={300}
          className="pointer-events-none absolute inset-0 size-full scale-150 opacity-40 blur-3xl"
        />
      )}

      {song ? (
        <CoverArt
          id={song.coverArt}
          size={256}
          className="pointer-events-none relative aspect-square h-full shrink-0"
        />
      ) : (
        <div className="relative flex aspect-square h-full shrink-0 items-center justify-center bg-elevated">
          <img src={logo} alt="" className="size-10 rounded-lg" />
        </div>
      )}

      <div data-tauri-drag-region className="relative flex min-w-0 flex-1 flex-col gap-2">
        <div data-tauri-drag-region className="min-w-0 pr-14">
          <p data-tauri-drag-region className="truncate text-sm font-semibold">
            {song?.title ?? "Nothing playing"}
          </p>
          <p data-tauri-drag-region className="truncate text-xs text-neutral-400">
            {song?.artist ?? "Pick something in Tide"}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Previous" disabled={!song} onClick={previous} className={control}>
            <SkipBack className="size-4 fill-current" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            disabled={!song}
            onClick={toggle}
            className="flex size-8 items-center justify-center rounded-full bg-white text-black transition-[scale] duration-150 ease-out hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <PlayIcon className={`size-3.5 fill-current ${playing ? "" : "translate-x-px"}`} />
          </button>
          <button type="button" aria-label="Next" disabled={!song} onClick={next} className={control}>
            <SkipForward className="size-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <button type="button" aria-label="Exit mini player" onClick={() => void exitMiniPlayer()} className={corner}>
          <Maximize2 className="size-3.5" />
        </button>
        <button type="button" aria-label="Close" onClick={() => void getCurrentWindow().close()} className={corner}>
          <X className="size-3.5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.75 bg-white/10">
        <div
          className="h-full bg-white"
          style={{ width: duration ? `${Math.min(100, (time / duration) * 100)}%` : "0%" }}
        />
      </div>
    </div>
  );
}
