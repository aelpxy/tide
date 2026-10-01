import { useEffect, useRef } from "react";
import { type Lyrics } from "../../lib/lyrics";
import { usePlayer } from "../../stores/player";

export function SyncedLyrics({ lyrics }: { lyrics: Lyrics }) {
  const time = usePlayer((state) => state.time);
  const seek = usePlayer((state) => state.seek);
  const list = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLButtonElement | null)[]>([]);

  const now = time * 1000;
  let active = -1;
  lyrics.lines.forEach((line, index) => {
    if ((line.start ?? 0) <= now) active = index;
  });

  // scroll only this list to keep the active line centered; scrollIntoView would move ancestors too
  useEffect(() => {
    const container = list.current;
    const line = lines.current[active];
    if (!container || !line) return;
    container.scrollTo({
      top: line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div ref={list} className="relative min-h-0 flex-1 overflow-y-auto px-3 py-[40%]">
      {lyrics.lines.map((line, index) => (
        <button
          key={index}
          ref={(element) => {
            lines.current[index] = element;
          }}
          type="button"
          onClick={() => line.start !== undefined && seek(line.start / 1000)}
          className={`block w-full rounded-md px-2 py-1.5 text-left text-xl leading-snug font-bold transition-[color,opacity] duration-300 ease-out hover:bg-white/6 ${
            index === active ? "text-white" : index < active ? "text-white/35" : "text-white/50"
          }`}
        >
          {line.text || "♪"}
        </button>
      ))}
    </div>
  );
}
