import type { ReactNode } from "react";
import { type Album } from "../../lib/subsonic";
import { ScrollRow } from "../ui/scroll-row";
import { AlbumCard } from "./album-card";

export function AlbumRow({ title, action, albums }: { title: string; action?: ReactNode; albums: Album[] }) {
  return (
    <ScrollRow title={title} action={action}>
      {albums.map((album) => (
        <div key={album.id} className="w-44 shrink-0">
          <AlbumCard album={album} />
        </div>
      ))}
    </ScrollRow>
  );
}
