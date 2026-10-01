import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import type { StarTarget } from "../../lib/subsonic";
import { setFavorite, useIsFavorite } from "../../stores/favorites";

export function HeartButton({
  type,
  id,
  starred,
  circle = false,
  className = "",
  iconClassName = "size-4",
}: {
  type: StarTarget;
  id: string;
  starred?: string;
  circle?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  const favorite = useIsFavorite(type, id, starred);

  const toggle = (event: MouseEvent) => {
    event.stopPropagation();
    void setFavorite(type, id, !favorite);
  };

  const color = favorite ? "text-icon" : circle ? "text-white" : "text-neutral-400 hover:text-white";
  const shape = circle ? "size-10 shrink-0 rounded-full bg-white/10 hover:bg-white/15" : "";

  return (
    <button
      type="button"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      onClick={toggle}
      className={`inline-flex items-center justify-center transition-[color,background-color,opacity,scale] duration-150 ease-out active:scale-90 ${shape} ${color} ${className}`}
    >
      <Heart className={`${iconClassName} ${favorite ? "fill-current" : ""}`} />
    </button>
  );
}
