import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ExternalLink } from "lucide-react";
import { button } from "../../lib/ui";
import { SettingsSection } from "./settings-section";

const REPOSITORY = "https://github.com/aelpxy/tide";

export function AboutSettings() {
  const [version, setVersion] = useState<string>();

  useEffect(() => {
    void getVersion().then(setVersion);
  }, []);

  return (
    <SettingsSection title="About">
      <div className="flex items-center justify-between gap-4 py-4">
        <p className="text-sm font-medium">Version</p>
        <p className="font-mono text-sm text-neutral-400 select-text">{version ?? "…"}</p>
      </div>
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">Source code</p>
          <p className="truncate text-[13px] text-neutral-400">aelpxy/tide on GitHub</p>
        </div>
        <button type="button" onClick={() => void openUrl(REPOSITORY)} className={button.secondary}>
          <ExternalLink className="size-4" />
          Open
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">License</p>
          <p className="truncate text-[13px] text-neutral-400">Tide is open source under the MIT License</p>
        </div>
        <button
          type="button"
          onClick={() => void openUrl(`${REPOSITORY}/blob/main/LICENSE`)}
          className={button.secondary}
        >
          <ExternalLink className="size-4" />
          View
        </button>
      </div>
    </SettingsSection>
  );
}
