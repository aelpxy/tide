import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { genreColor } from "../../lib/genres";
import { getAlbumsByGenre, type Genre } from "../../lib/subsonic";
import { CoverArt } from "../library/cover-art";

export function GenreTile({ genre }: { genre: Genre }) {
  const { data: cover, isPending } = useQuery({
    queryKey: ["genre-cover", genre.value],
    queryFn: () => getAlbumsByGenre(genre.value, 1).then((albums) => albums[0]?.coverArt ?? null),
  });

  return (
    <Link
      to="/genres/$genre"
      params={{ genre: genre.value }}
      style={{ backgroundColor: genreColor(genre.value) }}
      className="group relative flex h-36 flex-col overflow-hidden rounded-lg p-4 ring-1 ring-white/6 transition-[scale] duration-300 ease-out hover:scale-102 active:scale-98"
    >
      <span className="relative z-10 line-clamp-2 max-w-[65%] text-xl leading-tight font-bold tracking-tight">
        {genre.value}
      </span>
      <span className="relative z-10 mt-1 text-xs text-white/70">
        {genre.albumCount} {genre.albumCount === 1 ? "album" : "albums"}
      </span>

      {isPending ? (
        <div className="absolute -right-3 -bottom-3 size-24 rotate-18 skeleton rounded-md" />
      ) : (
        cover && (
          <CoverArt
            id={cover}
            size={200}
            className="absolute -right-3 -bottom-3 size-24 rotate-18 rounded-md shadow-xl shadow-black/50 transition-[rotate,translate,scale] duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-hover:rotate-10"
          />
        )
      )}
    </Link>
  );
}
