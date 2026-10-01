import { create } from "zustand";
import { getPlaylists, type Playlist } from "../lib/subsonic";

type PlaylistsState = {
  playlists: Playlist[];
  // songs waiting to go into a new playlist; null when the dialog is closed
  pendingSongIds: string[] | null;
};

export const usePlaylists = create<PlaylistsState>(() => ({
  playlists: [],
  pendingSongIds: null,
}));

export const refreshPlaylists = () =>
  getPlaylists()
    .then((playlists) => usePlaylists.setState({ playlists }))
    .catch(() => {});

export const openNewPlaylist = (songIds: string[] = []) => usePlaylists.setState({ pendingSongIds: songIds });

export const closeNewPlaylist = () => usePlaylists.setState({ pendingSongIds: null });
