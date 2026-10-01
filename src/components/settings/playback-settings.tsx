import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { setQuality, streamQualities, useSettings, type StreamQuality } from "../../stores/settings";
import { SettingsSection } from "./settings-section";

export function PlaybackSettings() {
  const quality = useSettings((state) => state.quality);

  return (
    <SettingsSection title="Playback">
      <RadioGroup
        value={quality}
        onValueChange={(value) => setQuality(value as StreamQuality)}
        aria-label="Streaming quality"
        className="divide-y divide-white/6"
      >
        {streamQualities.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-[13px] text-neutral-400">{option.description}</p>
            </div>
            <Radio.Root
              value={option.id}
              className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors duration-150 data-checked:border-icon data-checked:bg-icon"
            >
              <Radio.Indicator className="size-2 rounded-full bg-black" />
            </Radio.Root>
          </label>
        ))}
      </RadioGroup>
      <p className="py-3 text-[13px] text-neutral-400">Changes apply from the next song.</p>
    </SettingsSection>
  );
}
