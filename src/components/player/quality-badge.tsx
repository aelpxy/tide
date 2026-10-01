import { useCurrentSong } from "../../stores/player";
import { useSettings } from "../../stores/settings";
import { Hint } from "../ui/hint";

const LOSSLESS = ["flac", "alac", "wav", "aiff", "aif", "ape", "wv", "dsf", "dff"];

export function QualityBadge() {
  const song = useCurrentSong();
  const quality = useSettings((state) => state.quality);
  if (!song?.suffix) return null;

  const converted = quality !== "original";
  const format = converted ? "mp3" : song.suffix.toLowerCase();
  const lossless = LOSSLESS.includes(format);
  const khz = song.samplingRate && song.samplingRate / 1000;

  const hiRes = lossless && ((song.bitDepth ?? 16) > 16 || (song.samplingRate ?? 44100) > 48000);
  const label = converted ? `MP3 · ${quality}` : hiRes ? "Hi-Res" : lossless ? "Lossless" : format;

  const details = converted
    ? `Converted by your server to MP3 at ${quality} kbps (original: ${song.suffix.toUpperCase()})`
    : [
        format.toUpperCase(),
        lossless ? "lossless" : null,
        song.bitDepth ? `${song.bitDepth}-bit` : null,
        khz ? `${khz} kHz` : null,
        song.bitRate ? `${song.bitRate} kbps` : null,
      ]
        .filter(Boolean)
        .join(" · ");

  return (
    <Hint label={details}>
      <span
        tabIndex={0}
        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest whitespace-nowrap uppercase ${
          lossless && !converted ? "bg-icon/15 text-icon" : "bg-white/8 text-neutral-300"
        }`}
      >
        {label}
      </span>
    </Hint>
  );
}
