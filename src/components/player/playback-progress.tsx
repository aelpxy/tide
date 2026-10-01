import { useState } from "react";
import { formatDuration } from "../../lib/format";
import { useCurrentSong, usePlayer } from "../../stores/player";
import { SliderBar } from "../ui/slider-bar";

export function PlaybackProgress() {
  const song = useCurrentSong();
  const time = usePlayer((state) => state.time);
  const duration = usePlayer((state) => state.duration);
  const seek = usePlayer((state) => state.seek);
  const [dragging, setDragging] = useState<number | null>(null);

  return (
    <div className="flex w-full items-center gap-3 font-mono text-[11px] text-neutral-400 tabular-nums">
      <span className="w-10 text-right">{formatDuration(dragging ?? time)}</span>
      <SliderBar
        label="Seek"
        value={dragging ?? time}
        max={duration || 1}
        disabled={!song}
        onValueChange={setDragging}
        onValueCommitted={(value) => {
          seek(value);
          setDragging(null);
        }}
      />
      <span className="w-10">{formatDuration(duration)}</span>
    </div>
  );
}
