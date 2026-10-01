import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { useNowPlaying } from "../stores/now-playing";

const MINI_SIZE = new LogicalSize(420, 128);
const MIN_SIZE = new LogicalSize(800, 600);
let restoreSize = new LogicalSize(1280, 800);

export async function enterMiniPlayer() {
  const appWindow = getCurrentWindow();
  if (await appWindow.isMaximized()) await appWindow.toggleMaximize();
  restoreSize = (await appWindow.innerSize()).toLogical(await appWindow.scaleFactor());

  useNowPlaying.setState({ mini: true, open: false, drawer: false });
  await appWindow.setMinSize(null);
  await appWindow.setSize(MINI_SIZE);
  await appWindow.setResizable(false);
  await appWindow.setAlwaysOnTop(true);
}

export async function exitMiniPlayer() {
  const appWindow = getCurrentWindow();
  await appWindow.setAlwaysOnTop(false);
  await appWindow.setResizable(true);
  await appWindow.setMinSize(MIN_SIZE);
  await appWindow.setSize(restoreSize);
  useNowPlaying.setState({ mini: false });
}
