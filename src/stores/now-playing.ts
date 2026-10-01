import { create } from "zustand";

export type Panel = "queue" | "lyrics";

type NowPlayingState = {
  open: boolean;
  // side panel inside the now playing view
  panel: Panel | null;
  // queue panel over the library
  drawer: boolean;
  // the window is shrunk to the compact player
  mini: boolean;
};

export const useNowPlaying = create<NowPlayingState>(() => ({
  open: false,
  panel: "queue",
  drawer: false,
  mini: false,
}));

export const toggleNowPlaying = () => useNowPlaying.setState((state) => ({ open: !state.open, drawer: false }));

export const closeNowPlaying = () => useNowPlaying.setState({ open: false });

export const closePanel = () => useNowPlaying.setState({ panel: null });

export const togglePanel = (panel: Panel) =>
  useNowPlaying.setState((state) => ({ panel: state.panel === panel ? null : panel }));

export const closeQueueDrawer = () => useNowPlaying.setState({ drawer: false });

export const toggleQueue = () =>
  useNowPlaying.setState((state) =>
    state.open ? { panel: state.panel === "queue" ? null : "queue" } : { drawer: !state.drawer },
  );
