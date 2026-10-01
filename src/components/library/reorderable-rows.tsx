import { GripVertical } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { Song } from "../../lib/subsonic";
import { type Source } from "../../stores/player";
import { type MenuEntry } from "../menus/context-menu";
import { TrackRow } from "./track-row";

type Item = { key: string; song: Song };

// keys stay stable while dragging, even when a playlist holds the same song twice
const toItems = (songs: Song[]): Item[] => {
  const seen = new Map<string, number>();
  return songs.map((song) => {
    const count = seen.get(song.id) ?? 0;
    seen.set(song.id, count + 1);
    return { key: `${song.id}-${count}`, song };
  });
};

export function ReorderableRows({
  songs,
  full,
  columns,
  menuExtra,
  source,
  onReorder,
}: {
  songs: Song[];
  full: boolean;
  columns: string;
  menuExtra?: (index: number) => MenuEntry[];
  source?: Source;
  onReorder: (songs: Song[]) => Promise<void>;
}) {
  const [items, setItems] = useState(() => toItems(songs));
  const latest = useRef(items);
  latest.current = items;

  useEffect(() => setItems(toItems(songs)), [songs]);

  const commit = () => {
    const next = latest.current.map((item) => item.song);
    if (next.every((song, i) => song === songs[i])) return;
    onReorder(next).catch(() => setItems(toItems(songs)));
  };

  const ordered = items.map((item) => item.song);

  return (
    <Reorder.Group as="div" axis="y" values={items} onReorder={setItems} className="mt-2 flex flex-col">
      {items.map((item, index) => (
        <ReorderableRow key={item.key} item={item} onDragEnd={commit}>
          {(handle) => (
            <TrackRow
              songs={ordered}
              index={index}
              full={full}
              columns={columns}
              extra={menuExtra?.(index)}
              source={source}
              handle={handle}
            />
          )}
        </ReorderableRow>
      ))}
    </Reorder.Group>
  );
}

function ReorderableRow({
  item,
  onDragEnd,
  children,
}: {
  item: Item;
  onDragEnd: () => void;
  children: (handle: ReactNode) => ReactNode;
}) {
  const controls = useDragControls();

  const startDrag = (event: PointerEvent) => {
    event.stopPropagation();
    controls.start(event);
  };

  return (
    <Reorder.Item
      as="div"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.01, zIndex: 10, boxShadow: "0 12px 32px rgb(0 0 0 / 0.5)" }}
      className="relative rounded-md bg-black"
    >
      {children(
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={startDrag}
          onClick={(event) => event.stopPropagation()}
          className="flex cursor-grab touch-none items-center justify-center text-neutral-400 hover:text-white active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>,
      )}
    </Reorder.Item>
  );
}
