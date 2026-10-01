import { useState } from "react";

export function ArtistAbout({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="max-w-3xl">
      <h2 className="mb-3 text-xl font-bold tracking-tight">About</h2>
      <p
        className={`text-sm leading-relaxed whitespace-pre-line text-neutral-300 select-text ${expanded ? "" : "line-clamp-4"}`}
      >
        {text}
      </p>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="mt-2 text-sm font-semibold text-white transition-colors hover:text-icon"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </section>
  );
}
