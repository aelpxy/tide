import { Volume1, Volume2, VolumeX } from "lucide-react";
import { type WheelEvent } from "react";
import { usePlayer } from "../../stores/player";
import { SliderBar } from "../ui/slider-bar";

export function VolumeControl() {
  const volume = usePlayer((state) => state.volume);
  const setVolume = usePlayer((state) => state.setVolume);
  const toggleMute = usePlayer((state) => state.toggleMute);
  const Icon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  // a mouse wheel notch moves 5%; trackpads send smaller deltas for finer control
  const onWheel = (event: WheelEvent) => {
    const step = Math.max(-0.05, Math.min(0.05, -event.deltaY / 1000));
    setVolume(Math.min(1, Math.max(0, volume + step)));
  };

  return (
    <div onWheel={onWheel} className="flex items-center gap-3">
      <button
        type="button"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
        onClick={toggleMute}
        className="text-neutral-400 transition-[color,scale] duration-150 ease-out hover:text-white active:scale-90"
      >
        <Icon className="size-5" />
      </button>
      <div className="w-28">
        <SliderBar label="Volume" value={volume} max={1} step={0.01} onValueChange={setVolume} />
      </div>
    </div>
  );
}
