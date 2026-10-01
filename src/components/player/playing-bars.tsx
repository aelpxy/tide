import { usePlayer } from "../../stores/player";

// staggered timings keep the bars from moving in lockstep
const bars = [
  { duration: "0.9s", delay: "-0.2s" },
  { duration: "1.15s", delay: "-0.65s" },
  { duration: "0.8s", delay: "-0.4s" },
  { duration: "1.05s", delay: "-0.9s" },
];

export function PlayingBars({ className = "" }: { className?: string }) {
  const playing = usePlayer((state) => state.playing);

  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-0.5 ${className}`}>
      {bars.map((bar, index) => (
        <span
          key={index}
          className="h-full w-0.75 origin-bottom animate-equalizer rounded-full bg-current"
          style={{
            animationDuration: bar.duration,
            animationDelay: bar.delay,
            animationPlayState: playing ? "running" : "paused",
          }}
        />
      ))}
    </span>
  );
}
