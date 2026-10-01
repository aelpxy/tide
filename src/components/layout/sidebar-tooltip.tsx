import { Tooltip } from "@base-ui/react/tooltip";
import type { ComponentProps, ReactElement } from "react";
import { popover } from "../../lib/ui";

// names for sidebar entries while the sidebar is collapsed to icons; props and ref from an
// outer wrapper (like the context menu) are forwarded so both can share the same element
export function SidebarTooltip({
  label,
  disabled,
  children,
  ...props
}: {
  label: string;
  disabled: boolean;
  children: ReactElement;
} & Omit<ComponentProps<typeof Tooltip.Trigger>, "render" | "children">) {
  return (
    <Tooltip.Root disabled={disabled}>
      <Tooltip.Trigger {...props} render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={12}>
          <Tooltip.Popup
            className={`${popover} origin-(--transform-origin) px-2.5 py-1 text-xs font-medium text-white`}
          >
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
