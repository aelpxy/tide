export function mosaicIds(songs: { albumId?: string; coverArt?: string }[]) {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const song of songs) {
    const key = song.albumId ?? song.coverArt;
    if (!song.coverArt || !key || seen.has(key)) continue;
    seen.add(key);
    ids.push(song.coverArt);
    if (ids.length === 4) break;
  }
  return ids;
}
