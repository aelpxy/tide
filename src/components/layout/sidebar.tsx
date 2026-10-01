import { Tooltip } from "@base-ui/react/tooltip";
import { useLocation } from "@tanstack/react-router";
import {
  Disc3,
  Heart,
  House,
  ListMusic,
  MicVocal,
  Music,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  Shapes,
} from "lucide-react";
import { motion } from "motion/react";
import logo from "../../../logo.svg";
import { spring } from "../../lib/motion";
import { isMac } from "../../lib/platform";
import { openNewPlaylist, usePlaylists } from "../../stores/playlists";
import { Item, NavItem } from "./nav-item";
import { SidebarPlaylist } from "./sidebar-playlist";
import { Reveal } from "../ui/reveal";

const collection: Item[] = [
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/playlists", label: "Playlists", icon: ListMusic },
  { to: "/albums", label: "Albums", icon: Disc3 },
  { to: "/artists", label: "Artists", icon: MicVocal },
  { to: "/tracks", label: "Tracks", icon: Music },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useLocation({ select: (location) => location.pathname });

  const playlists = usePlaylists((state) => state.playlists);

  // a single playlist highlights its own sidebar entry, not the Playlists overview as well
  const isActive = (to: Item["to"]) => (to === "/" || to === "/playlists" ? pathname === to : pathname.startsWith(to));

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 76 : 240 }}
      transition={spring}
      className="flex h-full shrink-0 flex-col overflow-hidden border-r border-white/6 bg-black px-3 pb-25"
    >
      <div data-tauri-drag-region className="flex h-14 shrink-0 items-center px-2.5">
        {!isMac && (
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="size-7 shrink-0" />
            <Reveal show={!collapsed} className="text-lg font-bold tracking-tight">
              Tide
            </Reveal>
          </div>
        )}
      </div>

      <Tooltip.Provider delay={300}>
        <nav className="-mx-3 mt-2 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
          <NavItem item={{ to: "/", label: "Home", icon: House }} active={isActive("/")} collapsed={collapsed} />
          <NavItem
            item={{ to: "/genres", label: "Genres", icon: Shapes }}
            active={isActive("/genres")}
            collapsed={collapsed}
          />

          <div className="mt-6 mb-1 h-4 px-3">
            <Reveal
              show={!collapsed}
              className="block text-[11px] font-semibold tracking-widest text-neutral-500 uppercase"
            >
              My Collection
            </Reveal>
          </div>
          {collection.map((item) => (
            <NavItem key={item.to} item={item} active={isActive(item.to)} collapsed={collapsed} />
          ))}

          {!collapsed && (
            <>
              <div className="mt-6 mb-1 flex h-6 items-center justify-between pr-1 pl-3">
                <span className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">Playlists</span>
                <button
                  type="button"
                  aria-label="New playlist"
                  onClick={() => openNewPlaylist()}
                  className="flex size-6 items-center justify-center rounded-md text-neutral-500 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              {playlists.map((playlist) => (
                <SidebarPlaylist
                  key={playlist.id}
                  playlist={playlist}
                  active={pathname === `/playlists/${playlist.id}`}
                />
              ))}
            </>
          )}
        </nav>

        <div className="flex flex-col gap-0.5 border-t border-white/6 pt-2">
          <NavItem
            item={{ to: "/settings", label: "Settings", icon: Settings }}
            active={isActive("/settings")}
            collapsed={collapsed}
          />
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
          >
            <ToggleIcon className="size-5 shrink-0" strokeWidth={1.75} />
            <Reveal show={!collapsed}>Collapse</Reveal>
          </button>
        </div>
      </Tooltip.Provider>
    </motion.aside>
  );
}
