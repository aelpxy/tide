import { Link } from "@tanstack/react-router";
import type { Artist } from "../../lib/subsonic";
import { cardImage } from "../../lib/ui";
import { CoverArt } from "./cover-art";

export function ArtistCard({ artist, className = "" }: { artist: Artist; className?: string }) {
  return (
    <Link
      to="/artists/$artistId"
      params={{ artistId: artist.id }}
      data-result
      className={`group flex min-w-0 flex-col items-center gap-3 text-center ${className}`}
    >
      <div className="w-full overflow-hidden rounded-full">
        <CoverArt id={artist.coverArt} className={`aspect-square w-full ${cardImage}`} />
      </div>
      <span className="w-full truncate text-sm font-medium group-hover:underline">{artist.name}</span>
    </Link>
  );
}
