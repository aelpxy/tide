import { getCurrentWindow } from "@tauri-apps/api/window";
import { ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { isMac } from "../../lib/platform";
import { closeNowPlaying, togglePanel, useNowPlaying, type Panel } from "../../stores/now-playing";
import { WindowControls } from "../layout/window-controls";

const panels: { value: Panel; label: string }[] = [
  { value: "queue", label: "Queue" },
  { value: "lyrics", label: "Lyrics" },
];

export function NowPlayingTopBar() {
  const [fullscreen, setFullscreen] = useState(false);
  const panel = useNowPlaying((state) => state.panel);

  const toggleFullscreen = async () => {
    const appWindow = getCurrentWindow();
    const next = !(await appWindow.isFullscreen());
    await appWindow.setFullscreen(next);
    setFullscreen(next);
  };

  const control =
    "flex size-9 items-center justify-center rounded-full text-neutral-300 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90";
  const FullscreenIcon = fullscreen ? Minimize2 : Maximize2;

  return (
    <div
      data-tauri-drag-region
      className={`relative flex h-14 shrink-0 items-center justify-end gap-1 ${isMac ? "pr-4" : ""}`}
    >
      {panels.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={panel === item.value}
          onClick={() => togglePanel(item.value)}
          className={`h-9 rounded-full px-3 text-sm font-semibold transition-[color,background-color] duration-150 ease-out hover:bg-white/10 ${
            panel === item.value ? "text-white" : "text-neutral-400 hover:text-white"
          }`}
        >
          {item.label}
        </button>
      ))}
      <span className="mx-1 h-5 w-px bg-white/10" />
      <button
        type="button"
        aria-label={fullscreen ? "Exit full screen" : "Full screen"}
        onClick={() => void toggleFullscreen()}
        className={control}
      >
        <FullscreenIcon className="size-4" />
      </button>
      <button type="button" aria-label="Close now playing" onClick={closeNowPlaying} className={control}>
        <ChevronDown className="size-5" />
      </button>
      {!isMac && (
        <div className="ml-2 h-full">
          <WindowControls />
        </div>
      )}
    </div>
  );
}
