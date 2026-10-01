import { Switch } from "@base-ui/react/switch";

export function SettingToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between gap-4 py-4 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[13px] text-neutral-400">{description}</p>
      </div>
      <Switch.Root
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className="flex h-6 w-10 shrink-0 rounded-full bg-white/15 p-0.5 transition-colors duration-150 data-checked:bg-icon"
      >
        <Switch.Thumb className="size-5 rounded-full bg-white shadow-sm transition-[translate,background-color] duration-150 ease-out data-checked:translate-x-4 data-checked:bg-icon-on" />
      </Switch.Root>
    </label>
  );
}
