import { ContextMenu as Menu } from "@base-ui/react/context-menu";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import { popover } from "../../lib/ui";

export type MenuEntry =
  | { label: string; icon: LucideIcon; onSelect: () => void }
  | { label: string; icon: LucideIcon; entries: MenuEntry[] }
  | "separator";

const popup = `${popover} min-w-52 origin-(--transform-origin) p-1 outline-none`;

const item =
  "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] text-neutral-200 transition-colors duration-75 outline-none data-highlighted:bg-white/10 data-highlighted:text-white data-popup-open:bg-white/10";

export function ContextMenu({ entries, children }: { entries: MenuEntry[]; children: ReactElement }) {
  return (
    <Menu.Root>
      <Menu.Trigger render={children} />
      <Menu.Portal>
        <Menu.Positioner className="z-50 outline-none">
          <Menu.Popup className={popup}>
            <Entries entries={entries} />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function Entries({ entries }: { entries: MenuEntry[] }) {
  return entries.map((entry, index) => {
    if (entry === "separator") {
      return <Menu.Separator key={index} className="mx-2 my-1 h-px bg-white/10" />;
    }

    if ("entries" in entry) {
      return (
        <Menu.SubmenuRoot key={entry.label}>
          <Menu.SubmenuTrigger className={item}>
            <entry.icon className="size-4 text-neutral-400" strokeWidth={1.75} />
            <span className="flex-1">{entry.label}</span>
            <ChevronRight className="size-3.5 text-neutral-500" />
          </Menu.SubmenuTrigger>
          <Menu.Portal>
            <Menu.Positioner alignOffset={-4} sideOffset={4} className="z-50 outline-none">
              <Menu.Popup className={`${popup} max-h-80 overflow-y-auto`}>
                <Entries entries={entry.entries} />
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.SubmenuRoot>
      );
    }

    return (
      <Menu.Item key={entry.label} onClick={entry.onSelect} className={item}>
        <entry.icon className="size-4 text-neutral-400" strokeWidth={1.75} />
        <span className="truncate">{entry.label}</span>
      </Menu.Item>
    );
  });
}
