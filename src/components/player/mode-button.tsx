import { type ReactNode } from "react";
import { Hint } from "../ui/hint";

export function ModeButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Hint label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
        className={`relative flex items-center justify-center transition-[color,scale] duration-150 ease-out active:scale-90 disabled:pointer-events-none disabled:opacity-40 ${
          active ? "text-icon" : "text-neutral-400 hover:text-white"
        }`}
      >
        {children}
        <span
          className={`absolute -bottom-2 size-1 rounded-full bg-icon transition-[opacity,scale] duration-150 ease-out ${
            active ? "opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </button>
    </Hint>
  );
}
