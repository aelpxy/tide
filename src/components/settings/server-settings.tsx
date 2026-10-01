import { setServer, useServer } from "../../lib/subsonic";
import { button } from "../../lib/ui";
import { usePlayer } from "../../stores/player";
import { SettingsSection } from "./settings-section";

export function ServerSettings() {
  const server = useServer((state) => state.server);
  if (!server) return null;

  const signOut = () => {
    usePlayer.getState().stop();
    setServer(null);
  };

  return (
    <SettingsSection title="Server">
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{server.url}</p>
          <p className="text-[13px] text-neutral-400">Signed in as {server.username}</p>
        </div>
        <button type="button" onClick={signOut} className={button.secondary}>
          Sign out
        </button>
      </div>
    </SettingsSection>
  );
}
