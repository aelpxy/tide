import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { usePlayer } from "../stores/player";
import { useSettings } from "../stores/settings";
import { coverArtUrl } from "./subsonic";

type Control =
  | { action: "play" | "pause" | "toggle" | "next" | "previous" | "stop" }
  | { action: "seek"; position: number }
  | { action: "seekBy"; seconds: number };

function handle(control: Control) {
  const player = usePlayer.getState();
  switch (control.action) {
    case "play":
      if (!player.playing) player.toggle();
      break;
    case "pause":
    case "stop":
      if (player.playing) player.toggle();
      break;
    case "toggle":
      player.toggle();
      break;
    case "next":
      player.next();
      break;
    case "previous":
      player.previous();
      break;
    case "seek":
      player.seek(control.position);
      break;
    case "seekBy":
      player.seek(Math.min(player.duration, Math.max(0, player.time + control.seconds)));
      break;
  }
}

function sendNowPlaying() {
  const { queue, index, playing, time, duration } = usePlayer.getState();
  const song = queue[index];
  const nowPlaying = song && {
    title: song.title,
    artist: song.artist ?? null,
    album: song.album ?? null,
    coverUrl: song.coverArt ? coverArtUrl(song.coverArt, 512) : null,
    duration,
    position: time,
    playing,
  };
  void invoke("update_now_playing", { nowPlaying: nowPlaying ?? null }).catch(() => {});
}

export function setupNative() {
  void listen<Control>("media-control", (event) => handle(event.payload));

  usePlayer.subscribe((state, previous) => {
    const changedSong = state.queue[state.index] !== previous.queue[previous.index];
    const seeked = Math.abs(state.time - previous.time) > 2;

    if (changedSong || seeked || state.playing !== previous.playing || state.duration !== previous.duration) {
      sendNowPlaying();
    }
  });

  sendNowPlaying();

  const syncSettings = ({ closeToTray, discord }: { closeToTray: boolean; discord: boolean }) => {
    void invoke("set_close_to_tray", { enabled: closeToTray }).catch(() => {});
    void invoke("set_discord_enabled", { enabled: discord }).catch(() => {});
  };

  useSettings.subscribe((state, previous) => {
    if (state.closeToTray !== previous.closeToTray || state.discord !== previous.discord) syncSettings(state);
  });
  
  syncSettings(useSettings.getState());
}
