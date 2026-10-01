import { type Lyrics } from "../../lib/lyrics";

export function PlainLyrics({ lyrics }: { lyrics: Lyrics }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 text-lg leading-relaxed font-semibold text-neutral-200 select-text">
      {lyrics.lines.map((line, index) => (
        <p key={index} className="min-h-lh">
          {line.text}
        </p>
      ))}
    </div>
  );
}
