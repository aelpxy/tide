import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { type CSSProperties } from "react";
import { iconColors, useIconColor } from "../../hooks/use-icon-color";
import { SettingsSection } from "./settings-section";

export function AppearanceSettings() {
  const { iconColor, setIconColor } = useIconColor();
  const current = iconColors.find((c) => c.id === iconColor);

  return (
    <SettingsSection title="Appearance">
      <div className="flex items-center justify-between gap-4 py-4">
        <div>
          <p className="text-sm font-medium">Accent color</p>
          <p className="text-[13px] text-neutral-400">{current?.label}</p>
        </div>
        <RadioGroup
          value={iconColor}
          onValueChange={(value) => setIconColor(String(value))}
          aria-label="Accent color"
          className="flex gap-2.5"
        >
          {iconColors.map((color) => (
            <Radio.Root
              key={color.id}
              value={color.id}
              aria-label={color.label}
              style={{ "--swatch": color.color } as CSSProperties}
              className="flex size-6 items-center justify-center rounded-full bg-(--swatch) outline-offset-2 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-(--swatch) active:scale-95 data-checked:ring-2 data-checked:ring-(--swatch) data-checked:ring-offset-2 data-checked:ring-offset-surface"
            >
              <Radio.Indicator className="size-2 rounded-full bg-black" />
            </Radio.Root>
          ))}
        </RadioGroup>
      </div>
    </SettingsSection>
  );
}
