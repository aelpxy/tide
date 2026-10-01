import { Link } from "@tanstack/react-router";
import type { Source } from "../../stores/player";

export function SourceLink({ source, className = "" }: { source: Source; className?: string }) {
  const classes = `truncate underline-offset-2 hover:underline ${className}`;

  switch (source.type) {
    case "album":
      return (
        <Link to="/albums/$albumId" params={{ albumId: source.id }} className={classes}>
          {source.name}
        </Link>
      );
    case "playlist":
      return (
        <Link to="/playlists/$playlistId" params={{ playlistId: source.id }} className={classes}>
          {source.name}
        </Link>
      );
    case "artist":
      return (
        <Link to="/artists/$artistId" params={{ artistId: source.id }} className={classes}>
          {source.name}
        </Link>
      );
    case "favorites":
      return (
        <Link to="/favorites" className={classes}>
          {source.name}
        </Link>
      );
    case "tracks":
      return (
        <Link to="/tracks" className={classes}>
          {source.name}
        </Link>
      );
    case "genre":
      return (
        <Link to="/genres/$genre" params={{ genre: source.genre }} className={classes}>
          {source.name}
        </Link>
      );
    case "search":
      return (
        <Link to="/search" search={{ q: source.query }} className={classes}>
          {source.name}
        </Link>
      );
  }
}
