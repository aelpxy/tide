import { Music } from "lucide-react";
import { useState } from "react";
import { coverArtUrl } from "../../lib/subsonic";

export function CoverArt({ id, size = 300, className = "" }: { id?: string; size?: number; className?: string }) {
  const src = id ? coverArtUrl(id, size) : undefined;
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();

  if (!src || failed === src) {
    return (
      <div className={`flex items-center justify-center bg-elevated text-neutral-600 ${className}`}>
        <Music className="size-1/3" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${loaded === src ? "bg-elevated" : "skeleton"} ${className}`}>
      <img
        // cached images can finish loading before onLoad is attached
        ref={(img) => {
          if (img?.complete && img.naturalWidth) setLoaded(src);
        }}
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        onLoad={() => setLoaded(src)}
        onError={() => setFailed(src)}
        className={`block size-full object-cover transition-opacity duration-300 ${loaded === src ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
