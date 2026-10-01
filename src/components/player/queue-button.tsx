import { ListMusic } from "lucide-react";
import { toggleQueue, useNowPlaying } from "../../stores/now-playing";
import { useCurrentSong } from "../../stores/player";
import { Hint } from "../ui/hint";

export function QueueButton() {
  const song = useCurrentSong();
  const active = useNowPlaying((state) => (state.open ? state.panel === "queue" : state.drawer));

  return (
    <Hint label="Queue">
      <button
        type="button"
        aria-label={active ? "Hide queue" : "Show queue"}
        aria-pressed={active}
        disabled={!song}
        onClick={toggleQueue}
        className={`flex size-9 items-center justify-center rounded-full transition-[color,background-color,scale] duration-150 ease-out active:scale-90 disabled:pointer-events-none disabled:opacity-40 ${
          active ? "bg-white/10 text-icon" : "text-neutral-400 hover:bg-white/10 hover:text-white"
        }`}
      >
        <ListMusic className="size-5" />
      </button>
    </Hint>
  );
}
