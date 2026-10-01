import type { ReactNode } from "react";
import type { Artist } from "../../lib/subsonic";
import { ArtistCard } from "./artist-card";
import { ScrollRow } from "../ui/scroll-row";

export function ArtistRow({ title, action, artists }: { title: string; action?: ReactNode; artists: Artist[] }) {
  return (
    <ScrollRow title={title} action={action}>
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} className="w-40 shrink-0" />
      ))}
    </ScrollRow>
  );
}
