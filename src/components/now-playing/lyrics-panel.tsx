import { useEffect, useState } from "react";
import { getLyrics, type Lyrics } from "../../lib/lyrics";
import type { Song } from "../../lib/subsonic";
import { PlainLyrics } from "./plain-lyrics";
import { SyncedLyrics } from "./synced-lyrics";

export function LyricsPanel({ song }: { song: Song }) {
  const [lyrics, setLyrics] = useState<{ id: string; value: Lyrics | null }>();

  useEffect(() => {
    let cancelled = false;
    void getLyrics(song).then((value) => !cancelled && setLyrics({ id: song.id, value }));
    return () => {
      cancelled = true;
    };
  }, [song]);

  if (lyrics?.id !== song.id) {
    return (
      <div className="flex flex-col gap-4 px-5 py-4">
        {[70, 55, 80, 45, 65, 50].map((width, index) => (
          <div key={index} className="h-5 skeleton rounded" style={{ width: `${width}%` }} />
        ))}
      </div>
    );
  }

  if (!lyrics.value) {
    return <p className="px-5 py-4 text-sm text-neutral-400">No lyrics available for this song.</p>;
  }

  return lyrics.value.synced ? <SyncedLyrics lyrics={lyrics.value} /> : <PlainLyrics lyrics={lyrics.value} />;
}
