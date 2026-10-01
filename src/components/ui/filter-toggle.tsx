import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { motion } from "motion/react";
import { spring } from "../../lib/motion";

export type Filter = "all" | "favorites";

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "favorites", label: "Favorites" },
];

export function FilterToggle({
  value,
  onChange,
  label,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
  label: string;
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => next[0] && onChange(next[0] as Filter)}
      className="flex rounded-full bg-white/6 p-1"
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className="relative h-8 rounded-full px-4 text-sm font-medium text-neutral-400 transition-colors duration-150 hover:text-white data-pressed:text-black"
        >
          {option.value === value && (
            <motion.span
              layoutId={`filter-${label}`}
              transition={spring}
              className="absolute inset-0 rounded-full bg-white"
            />
          )}
          <span className="relative">{option.label}</span>
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
