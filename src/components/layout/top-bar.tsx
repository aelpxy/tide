import { useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { addRecentSearch } from "../../stores/recent-searches";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { WindowControls } from "./window-controls";

export function TopBar() {
  const router = useRouter();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;
    const timeout = setTimeout(() => navigate({ to: "/search", search: { q: query }, replace: true }), 250);
    return () => clearTimeout(timeout);
  }, [query, navigate]);

  const arrow =
    "flex size-8 items-center justify-center rounded-full bg-white/8 text-neutral-300 ring-1 ring-white/8 backdrop-blur-xl backdrop-saturate-150 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/14 hover:text-white active:scale-90";

  return (
    <header data-tauri-drag-region className="absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-2 pl-6">
      <ProgressiveBlur />
      <button type="button" aria-label="Back" onClick={() => router.history.back()} className={arrow}>
        <ChevronLeft className="size-4" />
      </button>
      <button type="button" aria-label="Forward" onClick={() => router.history.forward()} className={arrow}>
        <ChevronRight className="size-4" />
      </button>

      <label className="ml-3 flex h-9 w-80 items-center gap-2.5 rounded-lg bg-white/8 px-3 text-neutral-400 ring-1 ring-white/8 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-150 ease-out focus-within:bg-white/12 focus-within:ring-white/25 hover:bg-white/10">
        <Search className="size-4 shrink-0" />
        <input
          id="search"
          type="search"
          placeholder="Search"
          aria-keyshortcuts="Control+K"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") e.currentTarget.blur();
            if (e.key === "Enter") addRecentSearch(query);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              document.querySelector<HTMLElement>("#content [data-result]")?.focus();
            }
          }}
          onFocus={() => navigate({ to: "/search", search: { q: query } })}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
        />
      </label>

      <div data-tauri-drag-region className="h-full flex-1" />
      <WindowControls />
    </header>
  );
}
