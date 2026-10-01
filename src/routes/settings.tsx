import { createFileRoute } from "@tanstack/react-router";
import { AppearanceSettings } from "../components/settings/appearance-settings";
import { DesktopSettings } from "../components/settings/desktop-settings";
import { PlaybackSettings } from "../components/settings/playback-settings";
import { ServerSettings } from "../components/settings/server-settings";
import { ShortcutSettings } from "../components/settings/shortcut-settings";
import { StorageSettings } from "../components/settings/storage-settings";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  return (
    <main className="max-w-2xl px-8 pt-4 pb-10">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Settings</h1>
      <ServerSettings />
      <PlaybackSettings />
      <DesktopSettings />
      <AppearanceSettings />
      <ShortcutSettings />
      <StorageSettings />
    </main>
  );
}
