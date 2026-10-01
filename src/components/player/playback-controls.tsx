import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { useCurrentSong, usePlayer } from "../../stores/player";
import { ModeButton } from "./mode-button";

export function PlaybackControls() {
  const song = useCurrentSong();
  const playing = usePlayer((state) => state.playing);
  const shuffled = usePlayer((state) => state.original !== null);
  const repeat = usePlayer((state) => state.repeat);
  const { toggle, next, previous, toggleShuffle, cycleRepeat } = usePlayer.getState();
  const PlayIcon = playing ? Pause : Play;
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  const skip =
    "text-neutral-400 transition-[color,scale] duration-150 ease-out hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex items-center gap-6">
      <ModeButton label="Shuffle" active={shuffled} disabled={!song} onClick={toggleShuffle}>
        <Shuffle className="size-4" />
      </ModeButton>
      <button type="button" aria-label="Previous" disabled={!song} onClick={previous} className={skip}>
        <SkipBack className="size-5 fill-current" />
      </button>
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        disabled={!song}
        onClick={toggle}
        className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-150 ease-out hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
      >
        <PlayIcon className={`size-4 fill-current ${playing ? "" : "translate-x-px"}`} />
      </button>
      <button type="button" aria-label="Next" disabled={!song} onClick={next} className={skip}>
        <SkipForward className="size-5 fill-current" />
      </button>
      <ModeButton
        label={repeat === "one" ? "Repeat one" : repeat === "all" ? "Repeat all" : "Repeat"}
        active={repeat !== "off"}
        onClick={cycleRepeat}
      >
        <RepeatIcon className="size-4" />
      </ModeButton>
    </div>
  );
}
