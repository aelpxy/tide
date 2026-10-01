import { create } from "zustand";

export const streamQualities = [
  { id: "original", label: "Original", description: "Stream files exactly as stored on your server" },
  { id: "320", label: "High", description: "MP3 at 320 kbps, converted by your server" },
  { id: "192", label: "Normal", description: "MP3 at 192 kbps, a good balance for most connections" },
  { id: "128", label: "Data saver", description: "MP3 at 128 kbps, for slow or metered connections" },
] as const;

export type StreamQuality = (typeof streamQualities)[number]["id"];

export const useSettings = create<{ quality: StreamQuality; closeToTray: boolean; discord: boolean }>(() => ({
  quality: (localStorage.getItem("stream-quality") as StreamQuality | null) ?? "original",
  closeToTray: localStorage.getItem("close-to-tray") !== "false",
  discord: localStorage.getItem("discord") === "true",
}));

export function setQuality(quality: StreamQuality) {
  localStorage.setItem("stream-quality", quality);
  useSettings.setState({ quality });
}

export function setCloseToTray(enabled: boolean) {
  localStorage.setItem("close-to-tray", String(enabled));
  useSettings.setState({ closeToTray: enabled });
}

export function setDiscord(enabled: boolean) {
  localStorage.setItem("discord", String(enabled));
  useSettings.setState({ discord: enabled });
}
