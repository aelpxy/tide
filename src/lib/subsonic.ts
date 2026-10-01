import { notFound } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import SparkMD5 from "spark-md5";
import { create } from "zustand";
import { useSettings } from "../stores/settings";

export type Server = {
  url: string;
  username: string;
  token: string;
  salt: string;
};

export type Song = {
  id: string;
  title: string;
  artist?: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  coverArt?: string;
  duration?: number;
  track?: number;
  discNumber?: number;
  year?: number;
  starred?: string;
  suffix?: string;
  bitRate?: number;
  bitDepth?: number;
  samplingRate?: number;
};

export type Album = {
  id: string;
  name: string;
  artist?: string;
  artistId?: string;
  coverArt?: string;
  songCount: number;
  duration: number;
  year?: number;
  genre?: string;
  starred?: string;
  song?: Song[];
};

export type Artist = {
  id: string;
  name: string;
  coverArt?: string;
  albumCount?: number;
  starred?: string;
  album?: Album[];
};

export type Playlist = {
  id: string;
  name: string;
  songCount: number;
  duration: number;
  coverArt?: string;
  owner?: string;
  entry?: Song[];
};

export const useServer = create<{ server: Server | null }>(() => ({
  server: JSON.parse(localStorage.getItem("server") ?? "null"),
}));

export function setServer(server: Server | null) {
  if (server) localStorage.setItem("server", JSON.stringify(server));
  else localStorage.removeItem("server");
  useServer.setState({ server });
}

export async function findServer(input: string) {
  const address = input.trim().replace(/\/+$/, "");
  const candidates = /^https?:\/\//i.test(address) ? [address] : [`https://${address}`, `http://${address}`];

  for (const url of candidates) {
    try {
      const response = await fetch(`${url}/rest/ping?f=json&v=1.16.1&c=tide`);
      if ((await response.json())?.["subsonic-response"]) return url;
    } catch {
      // unreachable or not JSON, so try the next candidate
    }
  }
  throw new Error("Couldn't find a Subsonic server at that address.");
}

export function createServer(url: string, username: string, password: string): Server {
  const salt = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return {
    url,
    username: username.trim(),
    token: SparkMD5.hash(password + salt),
    salt,
  };
}

type Params = Record<string, string | number | (string | number)[] | undefined>;

function buildUrl(endpoint: string, params: Params = {}, server = useServer.getState().server) {
  if (!server) throw new Error("No server connected");

  const url = new URL(`${server.url}/rest/${endpoint}`);
  const query: Params = {
    u: server.username,
    t: server.token,
    s: server.salt,
    v: "1.16.1",
    c: "tide",
    f: "json",
    ...params,
  };
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(key, String(item));
  }
  return url.toString();
}

export async function request<T>(endpoint: string, params?: Params, server?: Server): Promise<T> {
  const response = await fetch(buildUrl(endpoint, params, server ?? undefined));
  if (!response.ok) throw new Error(`Server responded with ${response.status}`);

  const body = (await response.json())["subsonic-response"];
  // Subsonic error 70 is "data not found", which should render the 404 page
  if (body?.error?.code === 70) throw notFound();
  if (body?.status !== "ok") throw new Error(body?.error?.message ?? "Unexpected server response");
  return body as T;
}

export const ping = (server: Server) => request("ping", {}, server);

export const getAlbumList = (type: "newest" | "recent" | "frequent" | "random" | "alphabeticalByName", size = 50) =>
  request<{ albumList2: { album?: Album[] } }>("getAlbumList2", { type, size }).then((r) => r.albumList2.album ?? []);

export const getAlbum = (id: string) => request<{ album: Album }>("getAlbum", { id }).then((r) => r.album);

export const getArtists = () =>
  request<{ artists: { index?: { artist: Artist[] }[] } }>("getArtists").then((r) =>
    (r.artists.index ?? []).flatMap((index) => index.artist),
  );

export const getArtist = (id: string) => request<{ artist: Artist }>("getArtist", { id }).then((r) => r.artist);

export type ArtistInfo = { biography?: string; similarArtist?: Artist[] };

export const getArtistInfo = (id: string) =>
  request<{ artistInfo2: ArtistInfo }>("getArtistInfo2", { id, count: 12 }).then((r) => r.artistInfo2);

// popularity comes from Last.fm, so this is empty unless the server has it configured
export const getTopSongs = (artist: string) =>
  request<{ topSongs: { song?: Song[] } }>("getTopSongs", { artist, count: 10 }).then((r) => r.topSongs.song ?? []);

// an empty search3 query lists every song on Navidrome and most OpenSubsonic servers
export const getSongs = (offset = 0, count = 500) =>
  request<{ searchResult3: { song?: Song[] } }>("search3", {
    query: "",
    artistCount: 0,
    albumCount: 0,
    songCount: count,
    songOffset: offset,
  }).then((r) => r.searchResult3.song ?? []);

export type Genre = { value: string; songCount: number; albumCount: number };

export const getGenres = () => request<{ genres: { genre?: Genre[] } }>("getGenres").then((r) => r.genres.genre ?? []);

export const getAlbumsByGenre = (genre: string, size = 500) =>
  request<{ albumList2: { album?: Album[] } }>("getAlbumList2", { type: "byGenre", genre, size }).then(
    (r) => r.albumList2.album ?? [],
  );

export const getSongsByGenre = (genre: string) =>
  request<{ songsByGenre: { song?: Song[] } }>("getSongsByGenre", { genre, count: 500 }).then(
    (r) => r.songsByGenre.song ?? [],
  );

export const getPlaylists = () =>
  request<{ playlists: { playlist?: Playlist[] } }>("getPlaylists").then((r) => r.playlists.playlist ?? []);

export const getPlaylist = (id: string) =>
  request<{ playlist: Playlist }>("getPlaylist", { id }).then((r) => r.playlist);

export const createPlaylist = (name: string, songIds: string[] = []) =>
  request<{ playlist?: Playlist }>("createPlaylist", { name, songId: songIds }).then((r) => r.playlist);

export const updatePlaylist = (
  id: string,
  changes: { name?: string; songIdToAdd?: string[]; songIndexToRemove?: number[] },
) => request("updatePlaylist", { playlistId: id, ...changes });

// createPlaylist with a playlistId replaces that playlist's tracks, which is how Subsonic reorders
export const setPlaylistSongs = (id: string, songIds: string[]) =>
  request("createPlaylist", { playlistId: id, songId: songIds });

export const deletePlaylist = (id: string) => request("deletePlaylist", { id });

export const search = (query: string) =>
  request<{ searchResult3: { artist?: Artist[]; album?: Album[]; song?: Song[] } }>("search3", {
    query,
    artistCount: 12,
    albumCount: 18,
    songCount: 30,
  }).then((r) => ({
    artists: r.searchResult3.artist ?? [],
    albums: r.searchResult3.album ?? [],
    songs: r.searchResult3.song ?? [],
  }));

export type StarTarget = "song" | "album" | "artist";

const starParam = { song: "id", album: "albumId", artist: "artistId" } as const;

export const star = (type: StarTarget, id: string) => request("star", { [starParam[type]]: id });

export const unstar = (type: StarTarget, id: string) => request("unstar", { [starParam[type]]: id });

export const getStarred = () =>
  request<{ starred2: { song?: Song[]; album?: Album[]; artist?: Artist[] } }>("getStarred2").then((r) => ({
    songs: r.starred2.song ?? [],
    albums: r.starred2.album ?? [],
    artists: r.starred2.artist ?? [],
  }));

export const scrobble = (id: string, submission: boolean) =>
  request("scrobble", { id, submission: String(submission) }).catch(() => {});

export const coverArtUrl = (id: string, size = 300) => buildUrl("getCoverArt", { id, size });

export const streamUrl = (id: string) => {
  const { quality } = useSettings.getState();
  return buildUrl("stream", quality === "original" ? { id } : { id, format: "mp3", maxBitRate: quality });
};
