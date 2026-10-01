import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  Disc3,
  Heart,
  HeartOff,
  ListEnd,
  ListMusic,
  ListPlus,
  ListStart,
  MicVocal,
  Play,
  Plus,
  Shuffle,
} from "lucide-react";
import { MenuEntry } from "../components/menus/context-menu";
import { updatePlaylist, type Song, type StarTarget } from "../lib/subsonic";
import { setFavorite, useIsFavorite } from "../stores/favorites";
import { usePlayer, type Source } from "../stores/player";
import { openNewPlaylist, refreshPlaylists, usePlaylists } from "../stores/playlists";
import { toast } from "../stores/toast";

function useAddToPlaylist(load: () => Promise<Song[]>): MenuEntry {
  const router = useRouter();
  const playlists = usePlaylists((state) => state.playlists);

  const addTo = async (id: string, name: string) => {
    const songs = await load();
    if (!songs.length) return;
    await updatePlaylist(id, { songIdToAdd: songs.map((song) => song.id) });
    toast(`Added to ${name}`);
    await refreshPlaylists();
    await router.invalidate();
  };

  const newPlaylist = async () => openNewPlaylist((await load()).map((song) => song.id));

  return {
    label: "Add to playlist",
    icon: ListPlus,
    entries: [
      { label: "New playlist…", icon: Plus, onSelect: () => void newPlaylist() },
      ...(playlists.length ? ["separator" as const] : []),
      ...playlists.map((playlist) => ({
        label: playlist.name,
        icon: ListMusic,
        onSelect: () => void addTo(playlist.id, playlist.name).catch((err: Error) => toast(err.message)),
      })),
    ],
  };
}

function useFavoriteEntry(target?: { type: StarTarget; id: string; starred?: string }): MenuEntry[] {
  const favorite = useIsFavorite(target?.type ?? "song", target?.id ?? "", target?.starred);
  if (!target) return [];

  return [
    favorite
      ? {
          label: "Remove from favorites",
          icon: HeartOff,
          onSelect: () => void setFavorite(target.type, target.id, false),
        }
      : { label: "Add to favorites", icon: Heart, onSelect: () => void setFavorite(target.type, target.id, true) },
  ];
}

export function useSongEntries(
  songs: Song[],
  index: number,
  { extra = [], source, onPlay }: { extra?: MenuEntry[]; source?: Source; onPlay?: () => void } = {},
): MenuEntry[] {
  const navigate = useNavigate();
  const { play, playNext, addToQueue } = usePlayer.getState();
  const song = songs[index];
  const addToPlaylist = useAddToPlaylist(async () => [song]);
  const favorite = useFavoriteEntry({ type: "song", id: song.id, starred: song.starred });

  return [
    { label: "Play", icon: Play, onSelect: onPlay ?? (() => play(songs, index, source)) },
    {
      label: "Play next",
      icon: ListStart,
      onSelect: () => {
        playNext([song]);
        toast("Playing next");
      },
    },
    {
      label: "Add to queue",
      icon: ListEnd,
      onSelect: () => {
        addToQueue([song]);
        toast("Added to queue");
      },
    },
    addToPlaylist,
    ...favorite,
    ...goTo(song, navigate),
    ...(extra.length ? ["separator" as const, ...extra] : []),
  ];
}

export function useCollectionEntries(
  load: () => Promise<Song[]>,
  {
    extra = [],
    favorite: target,
    source,
  }: {
    extra?: MenuEntry[];
    favorite?: { type: StarTarget; id: string; starred?: string };
    source?: Source;
  } = {},
): MenuEntry[] {
  const { play, shuffle, playNext, addToQueue } = usePlayer.getState();
  const addToPlaylist = useAddToPlaylist(load);
  const favorite = useFavoriteEntry(target);
  const run = (action: (songs: Song[]) => void) => () => {
    void load().then((songs) => songs.length && action(songs));
  };

  return [
    { label: "Play", icon: Play, onSelect: run((songs) => play(songs, 0, source)) },
    { label: "Shuffle", icon: Shuffle, onSelect: run((songs) => shuffle(songs, source)) },
    {
      label: "Play next",
      icon: ListStart,
      onSelect: run((songs) => {
        playNext(songs);
        toast("Playing next");
      }),
    },
    {
      label: "Add to queue",
      icon: ListEnd,
      onSelect: run((songs) => {
        addToQueue(songs);
        toast("Added to queue");
      }),
    },
    addToPlaylist,
    ...favorite,
    ...(extra.length ? ["separator" as const, ...extra] : []),
  ];
}

export function goTo(song: Song | undefined, navigate: ReturnType<typeof useNavigate>): MenuEntry[] {
  const entries: MenuEntry[] = [];
  if (song?.albumId) {
    const albumId = song.albumId;
    entries.push({
      label: "Go to album",
      icon: Disc3,
      onSelect: () => navigate({ to: "/albums/$albumId", params: { albumId } }),
    });
  }
  if (song?.artistId) {
    const artistId = song.artistId;
    entries.push({
      label: "Go to artist",
      icon: MicVocal,
      onSelect: () => navigate({ to: "/artists/$artistId", params: { artistId } }),
    });
  }
  return entries.length ? ["separator", ...entries] : [];
}
