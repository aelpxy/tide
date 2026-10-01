import { usePlayer } from "../stores/player";

export const shortcuts = [
  { keys: ["Space"], action: "Play or pause" },
  { keys: ["←", "→"], action: "Seek back or forward 5 seconds" },
  { keys: ["Ctrl", "←"], action: "Previous track" },
  { keys: ["Ctrl", "→"], action: "Next track" },
  { keys: ["Ctrl", "↑"], action: "Volume up" },
  { keys: ["Ctrl", "↓"], action: "Volume down" },
  { keys: ["M"], action: "Mute or unmute" },
  { keys: ["Ctrl", "K"], action: "Search" },
];

const typing = "input, textarea, select, [contenteditable='true']";
// elements that already use Space or the arrow keys themselves
const interactive = `${typing}, button, a, [role=button], [role=slider], [role=menuitem], [role=radio], [role=switch], [role=option]`;

const focusSearch = () => document.querySelector<HTMLInputElement>("#search")?.focus();

function onKeyDown(event: KeyboardEvent) {
  const target = event.target instanceof Element ? event.target : null;
  if (event.defaultPrevented || target?.closest(typing)) return;

  const player = usePlayer.getState();
  const mod = event.ctrlKey || event.metaKey;
  const plain = !mod && !event.altKey && !event.shiftKey && !target?.closest(interactive);

  const withModifier: Record<string, () => void> = {
    k: focusSearch,
    f: focusSearch,
    ArrowRight: player.next,
    ArrowLeft: player.previous,
    ArrowUp: () => player.setVolume(Math.min(1, player.volume + 0.05)),
    ArrowDown: () => player.setVolume(Math.max(0, player.volume - 0.05)),
  };

  const withoutModifier: Record<string, () => void> = {
    " ": player.toggle,
    ArrowRight: () => player.seek(Math.min(player.duration, player.time + 5)),
    ArrowLeft: () => player.seek(Math.max(0, player.time - 5)),
    m: player.toggleMute,
  };

  const action = mod ? withModifier[event.key] : plain && player.index >= 0 ? withoutModifier[event.key] : undefined;
  if (!action) return;

  event.preventDefault();
  action();
}

export function setupShortcuts() {
  window.addEventListener("keydown", onKeyDown);
}
