import { isMac } from "../../lib/platform";
import { shortcuts } from "../../lib/shortcuts";
import { SettingsSection } from "./settings-section";

export function ShortcutSettings() {
  return (
    <SettingsSection title="Keyboard shortcuts">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.action} className="flex items-center justify-between gap-4 py-3">
          <p className="text-sm">{shortcut.action}</p>
          <div className="flex gap-1">
            {shortcut.keys.map((key) => (
              <kbd
                key={key}
                className="min-w-7 rounded-md bg-elevated px-2 py-0.5 text-center font-mono text-xs text-neutral-300 ring-1 ring-white/10"
              >
                {key === "Ctrl" && isMac ? "⌘" : key}
              </kbd>
            ))}
          </div>
        </div>
      ))}
      <p className="py-3 text-[13px] text-neutral-400">
        Media keys work through your system’s media controls, even while Tide is in the background.
      </p>
    </SettingsSection>
  );
}
