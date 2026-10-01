import { PictureInPicture2 } from "lucide-react";
import { enterMiniPlayer } from "../../lib/mini-player";
import { Hint } from "../ui/hint";

export function MiniPlayerButton() {
  return (
    <Hint label="Mini player">
      <button
        type="button"
        aria-label="Open mini player"
        onClick={() => void enterMiniPlayer()}
        className="flex size-9 items-center justify-center rounded-full text-neutral-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90"
      >
        <PictureInPicture2 className="size-5" />
      </button>
    </Hint>
  );
}
