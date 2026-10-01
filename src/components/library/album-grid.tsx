import { type Album } from "../../lib/subsonic";
import { AlbumCard } from "./album-card";

export function AlbumGrid({ albums }: { albums: Album[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-x-6 gap-y-8">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
