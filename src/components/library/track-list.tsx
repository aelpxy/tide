import { Disc3 } from "lucide-react";
import { Fragment } from "react";
import type { Song } from "../../lib/subsonic";
import { type Source } from "../../stores/player";
import { type MenuEntry } from "../menus/context-menu";
import { ReorderableRows } from "./reorderable-rows";
import { TrackRow } from "./track-row";

export function TrackList({
  songs,
  full = false,
  menuExtra,
  source,
  onReorder,
}: {
  songs: Song[];
  full?: boolean;
  menuExtra?: (index: number) => MenuEntry[];
  source?: Source;
  onReorder?: (songs: Song[]) => Promise<void>;
}) {
  const columns = full
    ? "grid-cols-[2.5rem_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_2rem_4rem]"
    : "grid-cols-[2.5rem_minmax(0,1fr)_2rem_4rem]";
  const multiDisc = !full && new Set(songs.map((song) => song.discNumber ?? 1)).size > 1;

  return (
    <div>
      <div
        className={`grid ${columns} h-9 items-center gap-4 border-b border-white/6 px-3 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase`}
      >
        <span className="text-right">#</span>
        <span>Title</span>
        {full && <span>Artist</span>}
        {full && <span>Album</span>}
        <span />
        <span className="text-right">Time</span>
      </div>

      {onReorder ? (
        <ReorderableRows
          songs={songs}
          full={full}
          columns={columns}
          menuExtra={menuExtra}
          source={source}
          onReorder={onReorder}
        />
      ) : (
        <div className="mt-2 flex flex-col">
          {songs.map((song, index) => (
            <Fragment key={`${song.id}-${index}`}>
              {multiDisc && song.discNumber !== songs[index - 1]?.discNumber && (
                <div className="flex items-center gap-2 px-3 pt-5 pb-2 text-xs font-semibold tracking-widest text-neutral-400 uppercase first:pt-1">
                  <Disc3 className="size-3.5" />
                  Disc {song.discNumber}
                </div>
              )}
              <TrackRow
                songs={songs}
                index={index}
                full={full}
                columns={columns}
                extra={menuExtra?.(index)}
                source={source}
              />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
