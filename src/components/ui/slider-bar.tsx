import { Slider } from "@base-ui/react/slider";

export function SliderBar({
  label,
  value,
  max,
  step,
  disabled,
  onValueChange,
  onValueCommitted,
}: {
  label: string;
  value: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onValueChange: (value: number) => void;
  onValueCommitted?: (value: number) => void;
}) {
  return (
    <Slider.Root
      value={value}
      min={0}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
      className="group flex-1"
    >
      <Slider.Control className="flex h-4 items-center">
        <Slider.Track className="h-1 w-full rounded-full bg-white/20">
          <Slider.Indicator className="rounded-full bg-white transition-colors duration-150 group-hover:bg-icon" />
          <Slider.Thumb
            aria-label={label}
            className="size-3 rounded-full bg-white opacity-0 shadow transition-[opacity,scale] duration-150 ease-out group-hover:opacity-100 focus-visible:opacity-100 active:scale-125"
          />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
