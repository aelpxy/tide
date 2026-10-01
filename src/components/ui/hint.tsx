import { Tooltip } from "@base-ui/react/tooltip";
import { type ReactElement } from "react";
import { popover } from "../../lib/ui";

export function Hint({ label, children }: { label: string; children: ReactElement }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="top" sideOffset={10}>
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
