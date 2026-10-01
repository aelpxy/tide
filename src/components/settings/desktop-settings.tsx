import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { setCloseToTray, setDiscord, useSettings } from "../../stores/settings";
import { SettingToggle } from "./setting-toggle";
import { SettingsSection } from "./settings-section";

export function DesktopSettings() {
  const closeToTray = useSettings((state) => state.closeToTray);
  const discord = useSettings((state) => state.discord);
  const [discordAvailable, setDiscordAvailable] = useState(false);

  useEffect(() => {
    void invoke<boolean>("discord_available")
      .then(setDiscordAvailable)
      .catch(() => {});
  }, []);

  return (
    <SettingsSection title="Desktop">
      <SettingToggle
        label="Close to tray"
        description="Closing the window keeps Tide playing in the system tray. Quit from the tray menu."
        checked={closeToTray}
        onChange={setCloseToTray}
      />
      <SettingToggle
        label="Show on Discord"
        description={
          discordAvailable
            ? "Show the song you're listening to on your Discord profile while Discord is open."
            : "Not set up in this build: a Discord application ID is needed."
        }
        checked={discord && discordAvailable}
        disabled={!discordAvailable}
        onChange={setDiscord}
      />
    </SettingsSection>
  );
}
