import { request, type Song } from "./subsonic";

export type Lyrics = { synced: boolean; lines: { start?: number; text: string }[] };

type StructuredLyrics = { synced: boolean; offset?: number; line?: { start?: number; value: string }[] };

const cache = new Map<string, Lyrics | null>();

export async function getLyrics(song: Song): Promise<Lyrics | null> {
  if (cache.has(song.id)) return cache.get(song.id)!;

  let lyrics: Lyrics | null = null;
  try {
    const body = await request<{ lyricsList?: { structuredLyrics?: StructuredLyrics[] } }>("getLyricsBySongId", {
      id: song.id,
    });
    const list = body.lyricsList?.structuredLyrics ?? [];
    const best = list.find((entry) => entry.synced && entry.line?.length) ?? list.find((entry) => entry.line?.length);

    if (best?.line) {
      lyrics = {
        synced: best.synced,
        lines: best.line.map((line) => ({
          start: line.start === undefined ? undefined : line.start + (best.offset ?? 0),
          text: line.value,
        })),
      };
    }
  } catch {
  }

  if (!lyrics && song.artist && song.title) {
    try {
      const body = await request<{ lyrics?: { value?: string } }>("getLyrics", {
        artist: song.artist,
        title: song.title,
      });
      const text = body.lyrics?.value;
      if (text?.trim()) lyrics = { synced: false, lines: text.split(/\r?\n/).map((line) => ({ text: line })) };
    } catch {
    }
  }

  cache.set(song.id, lyrics);
  return lyrics;
}
