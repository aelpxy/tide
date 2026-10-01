import { create } from "zustand";
import { star, unstar, type StarTarget } from "../lib/subsonic";
import { toast } from "./toast";

// local changes win over the `starred` field in already-loaded data until it is refetched
export const useFavorites = create<{ overrides: Record<string, boolean>; version: number }>(() => ({
  overrides: {},
  version: 0,
}));

const key = (type: StarTarget, id: string) => `${type}:${id}`;

export function useIsFavorite(type: StarTarget, id: string, starred?: string) {
  return useFavorites((state) => state.overrides[key(type, id)] ?? Boolean(starred));
}

export async function setFavorite(type: StarTarget, id: string, value: boolean) {
  const set = (next: boolean) =>
    useFavorites.setState((state) => ({ overrides: { ...state.overrides, [key(type, id)]: next } }));

  set(value);
  try {
    await (value ? star(type, id) : unstar(type, id));
    useFavorites.setState((state) => ({ version: state.version + 1 }));
    toast(value ? "Added to favorites" : "Removed from favorites");
  } catch (err) {
    set(!value);
    toast(err instanceof Error ? err.message : "Couldn't update favorites");
  }
}
