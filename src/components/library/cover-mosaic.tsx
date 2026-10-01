import { CoverArt } from "./cover-art";

export function CoverMosaic({ ids, size = 300, className = "" }: { ids: string[]; size?: number; className?: string }) {
  if (ids.length < 4) return <CoverArt id={ids[0]} size={size} className={className} />;

  return (
    <div className={`grid grid-cols-2 grid-rows-2 overflow-hidden ${className}`}>
      {ids.slice(0, 4).map((id) => (
        <CoverArt key={id} id={id} size={size / 2} className="size-full" />
      ))}
    </div>
  );
}
