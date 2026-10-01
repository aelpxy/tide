import { type Album, type Artist, type Song } from "./subsonic";

export type TopResult =
  { kind: "artist"; artist: Artist } | { kind: "album"; album: Album } | { kind: "song"; song: Song };

export function pickTopResult(
  query: string,
  results: { artists: Artist[]; albums: Album[]; songs: Song[] },
): TopResult | null {
  const q = query.toLowerCase();
  const matches = (name: string) => name.toLowerCase() === q || name.toLowerCase().startsWith(q);

  const artist = results.artists.find((a) => matches(a.name));
  if (artist) return { kind: "artist", artist };
  const album = results.albums.find((a) => matches(a.name));
  if (album) return { kind: "album", album };
  if (results.songs[0]) return { kind: "song", song: results.songs[0] };
  if (results.artists[0]) return { kind: "artist", artist: results.artists[0] };
  if (results.albums[0]) return { kind: "album", album: results.albums[0] };
  return null;
}
