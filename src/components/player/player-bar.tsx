import { MiniPlayerButton } from "./mini-player-button";
import { NowPlayingButton } from "./now-playing-button";
import { NowPlayingInfo } from "./now-playing-info";
import { PlaybackControls } from "./playback-controls";
import { PlaybackProgress } from "./playback-progress";
import { QualityBadge } from "./quality-badge";
import { QueueButton } from "./queue-button";
import { VolumeControl } from "./volume-control";

export function PlayerBar() {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 grid h-22 grid-cols-[1fr_minmax(0,600px)_1fr] items-center gap-6 border-t border-white/8 bg-surface/70 px-4 backdrop-blur-2xl backdrop-saturate-150">
      <NowPlayingInfo />
      <div className="flex flex-col items-center gap-1.5">
        <PlaybackControls />
        <PlaybackProgress />
      </div>
      <div className="flex items-center justify-end gap-4">
        <QualityBadge />
        <QueueButton />
        <VolumeControl />
        <MiniPlayerButton />
        <NowPlayingButton />
      </div>
    </footer>
  );
}
