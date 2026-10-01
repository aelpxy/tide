import { Play, Shuffle } from "lucide-react";
import type { ReactNode } from "react";
import type { Song } from "../../lib/subsonic";
import { button } from "../../lib/ui";
import { usePlayer, type Source } from "../../stores/player";
import { CoverArt } from "./cover-art";
import { CoverMosaic } from "./cover-mosaic";

export function CollectionHeader({
  label,
  coverArt,
  mosaic,
  title,
  subtitle,
  meta,
  songs,
  round = false,
  actions,
  source,
}: {
  label: string;
  coverArt?: string;
  mosaic?: string[];
  title: string;
  subtitle?: ReactNode;
  meta?: string;
  songs?: Song[];
  round?: boolean;
  actions?: ReactNode;
  source?: Source;
}) {
  const play = usePlayer((state) => state.play);
  const shuffle = usePlayer((state) => state.shuffle);

  return (
    <header className="relative overflow-hidden">
      {coverArt && (
        <CoverArt id={coverArt} size={300} className="absolute inset-0 size-full scale-125 opacity-50 blur-3xl" />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/60 to-black" />

      <div className="relative flex items-end gap-8 px-8 pt-8 pb-10">
        {mosaic ? (
          <CoverMosaic ids={mosaic} size={480} className="size-56 shrink-0 rounded-md shadow-2xl" />
        ) : (
          <CoverArt
            id={coverArt}
            size={480}
            className={`size-56 shrink-0 shadow-2xl ${round ? "rounded-full" : "rounded-md"}`}
          />
        )}
        <div className="flex min-w-0 flex-col gap-2 pb-1">
          <p className="text-xs font-semibold tracking-widest text-neutral-300 uppercase">{label}</p>
          <h1 className="line-clamp-2 text-5xl leading-tight font-bold tracking-tight">{title}</h1>
          {subtitle && <div className="truncate text-base font-medium text-white/90">{subtitle}</div>}
          {meta && <p className="text-sm text-neutral-400">{meta}</p>}

          {(songs || actions) && (
            <div className="mt-4 flex gap-3">
              {songs && (
                <>
                  <button
                    type="button"
                    disabled={!songs.length}
                    onClick={() => play(songs, 0, source)}
                    className={button.primary}
                  >
                    <Play className="size-4 fill-current" />
                    Play
                  </button>
                  <button
                    type="button"
                    disabled={!songs.length}
                    onClick={() => shuffle(songs, source)}
                    className={button.secondary}
                  >
                    <Shuffle className="size-4" />
                    Shuffle
                  </button>
                </>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
