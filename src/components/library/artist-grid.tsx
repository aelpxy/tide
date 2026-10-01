import type { Artist } from "../../lib/subsonic";
import { ArtistCard } from "./artist-card";

export function ArtistGrid({ artists }: { artists: Artist[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-6 gap-y-8">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}
