import { create } from "zustand";

const KEY = "recent-searches";
const LIMIT = 8;

export const useRecentSearches = create<{ searches: string[] }>(() => ({
  searches: JSON.parse(localStorage.getItem(KEY) ?? "[]"),
}));

function save(searches: string[]) {
  localStorage.setItem(KEY, JSON.stringify(searches));
  useRecentSearches.setState({ searches });
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return;
  const others = useRecentSearches.getState().searches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
  save([trimmed, ...others].slice(0, LIMIT));
}

export function removeRecentSearch(query: string) {
  save(useRecentSearches.getState().searches.filter((s) => s !== query));
}
