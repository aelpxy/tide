import { usePlayer, type Source } from "../stores/player";
import { getAlbum, type Album } from "./subsonic";

export const albumSource = (album: Pick<Album, "id" | "name">): Source => ({
  type: "album",
  id: album.id,
  name: album.name,
});

export const getAlbumSongs = (id: string) => getAlbum(id).then((album) => album.song ?? []);

export async function playAlbum(album: Pick<Album, "id" | "name">) {
  const songs = await getAlbumSongs(album.id);
  if (songs.length) usePlayer.getState().play(songs, 0, albumSource(album));
}
