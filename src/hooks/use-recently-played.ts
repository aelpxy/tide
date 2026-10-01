import { useMemo } from "react";
import { type Album } from "../lib/subsonic";
import { useCurrentSong, usePlayer } from "../stores/player";

export function useRecentlyPlayed(serverRecent: Album[]) {
  const current = useCurrentSong();
  const history = usePlayer((state) => state.history);

  return useMemo(() => {
    const seen = new Set<string>();
    const albums: Album[] = [];
    const add = (album: Album) => {
      if (seen.has(album.id)) return;
      seen.add(album.id);
      albums.push(album);
    };

    for (const song of [current, ...[...history].reverse()]) {
      if (!song?.albumId) continue;
      add({
        id: song.albumId,
        name: song.album ?? "",
        artist: song.artist,
        artistId: song.artistId,
        coverArt: song.coverArt,
        songCount: 0,
        duration: 0,
      });
    }
    serverRecent.forEach(add);
    return albums.slice(0, 18);
  }, [current, history, serverRecent]);
}
