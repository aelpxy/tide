import { ChevronDown, ChevronUp } from "lucide-react";
import { toggleNowPlaying, useNowPlaying } from "../../stores/now-playing";
import { useCurrentSong } from "../../stores/player";
import { Hint } from "../ui/hint";

export function NowPlayingButton() {
  const song = useCurrentSong();
  const open = useNowPlaying((state) => state.open);
  const Icon = open ? ChevronDown : ChevronUp;

  return (
    <Hint label={open ? "Close now playing" : "Now playing"}>
      <button
        type="button"
        aria-label={open ? "Close now playing" : "Open now playing"}
        aria-pressed={open}
        disabled={!song}
        onClick={toggleNowPlaying}
        className={`flex size-9 items-center justify-center rounded-full transition-[color,background-color,scale] duration-150 ease-out active:scale-90 disabled:pointer-events-none disabled:opacity-40 ${
          open ? "bg-white/10 text-icon" : "text-neutral-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="size-5" />
      </button>
    </Hint>
  );
}
