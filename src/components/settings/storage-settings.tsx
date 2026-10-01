import { appCacheDir, appLocalDataDir } from "@tauri-apps/api/path";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { button } from "../../lib/ui";
import { usePlayer } from "../../stores/player";
import { toast } from "../../stores/toast";
import { SettingsSection } from "./settings-section";

const storedData = [
  { label: "Sign-in", keys: ["server"] },
  { label: "Queue and playback position", keys: ["playback", "playback-position"] },
  { label: "Preferences", keys: ["volume", "icon-color"] },
];

const formatBytes = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const storedSize = (keys: string[]) =>
  keys.reduce((total, key) => total + new Blob([localStorage.getItem(key) ?? ""]).size, 0);

export function StorageSettings() {
  const [folders, setFolders] = useState<{ data: string; cache: string } | null>(null);
  const history = usePlayer((state) => state.history);

  useEffect(() => {
    void Promise.all([appLocalDataDir(), appCacheDir()]).then(([data, cache]) => setFolders({ data, cache }));
  }, []);

  const reveal = (path: string) =>
    revealItemInDir(path).catch(() =>
      toast("That folder doesn't exist yet. Tide creates it once it stores something there."),
    );

  return (
    <SettingsSection title="Storage">
      {folders &&
        [
          { label: "Data folder", description: "Your sign-in, queue and preferences", path: folders.data },
          { label: "Cache folder", description: "Temporary files such as cover art", path: folders.cache },
        ].map((folder) => (
          <div key={folder.label} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">{folder.label}</p>
              <p className="text-[13px] text-neutral-400">{folder.description}</p>
              <p className="mt-1 truncate font-mono text-xs text-neutral-500 select-text" title={folder.path}>
                {folder.path}
              </p>
            </div>
            <button type="button" onClick={() => void reveal(folder.path)} className={button.secondary}>
              <FolderOpen className="size-4" />
              Show
            </button>
          </div>
        ))}

      {storedData.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4 py-3">
          <p className="text-sm">{item.label}</p>
          <p className="font-mono text-xs text-neutral-400">{formatBytes(storedSize(item.keys))}</p>
        </div>
      ))}

      <div className="flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-sm">Listening history</p>
          <p className="text-[13px] text-neutral-400">
            {history.length} {history.length === 1 ? "song" : "songs"} · shown in the play queue
          </p>
        </div>
        <button
          type="button"
          disabled={!history.length}
          onClick={() => {
            usePlayer.setState({ history: [] });
            toast("Listening history cleared");
          }}
          className={button.secondary}
        >
          Clear
        </button>
      </div>
    </SettingsSection>
  );
}
