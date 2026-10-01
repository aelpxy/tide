import { Link } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { spring } from "../../lib/motion";
import { Reveal } from "../ui/reveal";
import { SidebarTooltip } from "./sidebar-tooltip";

export type Item = {
  to: "/" | "/genres" | "/favorites" | "/albums" | "/artists" | "/tracks" | "/playlists" | "/settings";
  label: string;
  icon: LucideIcon;
};

export function NavItem({
  item: { to, label, icon: Icon },
  active,
  collapsed,
}: {
  item: Item;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <SidebarTooltip label={label} disabled={!collapsed}>
      <Link
        to={to}
        className={`relative flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${
          active ? "text-white" : "text-neutral-400 hover:text-white"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-md bg-white/8"
            transition={spring}
          />
        )}
        <Icon className={`relative size-5 shrink-0 ${active ? "text-icon" : ""}`} strokeWidth={1.75} />
        <Reveal show={!collapsed} className="relative">
          {label}
        </Reveal>
      </Link>
    </SidebarTooltip>
  );
}
