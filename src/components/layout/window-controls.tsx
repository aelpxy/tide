import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { isMac } from "../../lib/platform";

export function WindowControls() {
  // macOS draws native traffic lights via titleBarStyle "Overlay"
  if (isMac) return null;

  const appWindow = getCurrentWindow();
  const button = "flex h-full w-11 items-center justify-center text-neutral-400 transition-colors";

  return (
    <div className="flex h-full shrink-0">
      <button
        type="button"
        aria-label="Minimize"
        onClick={() => appWindow.minimize()}
        className={`${button} hover:bg-white/10 hover:text-white`}
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Maximize"
        onClick={() => appWindow.toggleMaximize()}
        className={`${button} hover:bg-white/10 hover:text-white`}
      >
        <Square className="size-3" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Close"
        onClick={() => appWindow.close()}
        className={`${button} hover:bg-[#e81123] hover:text-white`}
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
