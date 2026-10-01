// stronger blurs fade out sooner, so the bar is crisp-to-soft from bottom to top with no hard edge
const blurLayers = [
  { blur: 2, fadeFrom: 70 },
  { blur: 6, fadeFrom: 50 },
  { blur: 14, fadeFrom: 30 },
  { blur: 28, fadeFrom: 10 },
];

export function ProgressiveBlur() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {blurLayers.map((layer) => {
        const mask = `linear-gradient(to bottom, black ${layer.fadeFrom}%, transparent 100%)`;
        return (
          <div
            key={layer.blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${layer.blur}px) saturate(150%)`,
              WebkitBackdropFilter: `blur(${layer.blur}px) saturate(150%)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-transparent" />
    </div>
  );
}
