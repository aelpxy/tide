import { create } from "zustand";
import { scrobble, streamUrl, useServer, type Song } from "../lib/subsonic";

export type Source = { name: string } & (
  | { type: "album" | "playlist" | "artist"; id: string }
  | { type: "favorites" | "tracks" }
  | { type: "genre"; genre: string }
  | { type: "search"; query: string }
);

export type Repeat = "off" | "all" | "one";

type PlayerState = {
  queue: Song[];
  index: number;
  // how many songs right after the current one were added by "Play next" / "Add to queue"
  queued: number;
  // the queue in its unshuffled order while shuffle is on
  original: Song[] | null;
  source: Source | null;
  // songs that actually played, oldest first; kept across new queues
  history: Song[];
  repeat: Repeat;
  playing: boolean;
  time: number;
  duration: number;
  volume: number;
  play: (queue: Song[], index?: number, source?: Source) => void;
  shuffle: (songs: Song[], source?: Source) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playNext: (songs: Song[]) => void;
  addToQueue: (songs: Song[]) => void;
  jumpTo: (index: number) => void;
  playFromHistory: (position: number) => void;
  removeFromQueue: (index: number) => void;
  clearUpcoming: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  stop: () => void;
};

// two decks so the next song can load in the background and start without a gap
const decks = [new Audio(), new Audio()];
let active = 0;
const audio = () => decks[active];
const spare = () => decks[1 - active];
let preloadedId: string | null = null;
let unmutedVolume = 1;

const PLAYBACK_KEY = "playback";
const POSITION_KEY = "playback-position";

type SavedPlayback = {
  queue: Song[];
  index: number;
  queued?: number;
  // positions in `queue`, so restored shuffle state keeps referring to the same song objects
  original: number[] | null;
  source: Source | null;
  history: Song[];
  repeat: Repeat;
};

function readSaved(): SavedPlayback | null {
  if (!useServer.getState().server) return null;
  try {
    return JSON.parse(localStorage.getItem(PLAYBACK_KEY) ?? "null");
  } catch {
    return null;
  }
}

const saved = readSaved();
const savedQueue = saved?.queue ?? [];
for (const deck of decks) deck.volume = Number(localStorage.getItem("volume") ?? 1);

function shuffled(songs: Song[]) {
  const result = [...songs];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: savedQueue,
  index: saved?.queue[saved.index] ? saved.index : -1,
  queued: saved?.queued ?? 0,
  original: saved?.original?.map((position) => savedQueue[position]) ?? null,
  source: saved?.source ?? null,
  history: saved?.history ?? [],
  repeat: saved?.repeat ?? "off",
  playing: false,
  time: 0,
  duration: 0,
  volume: decks[0].volume,

  play: (queue, index = 0, source) => {
    if (get().original) {
      const first = queue[index];
      set({ original: queue, queue: [first, ...shuffled(queue.filter((_, i) => i !== index))], index: 0 });
    } else {
      set({ queue, index });
    }
    set({ source: source ?? null, queued: 0 });
    load(get().queue[get().index]);
  },

  shuffle: (songs, source) => {
    set({ original: songs, queue: shuffled(songs), index: 0, source: source ?? null, queued: 0 });
    load(get().queue[0]);
  },

  toggleShuffle: () => {
    const { queue, index, queued, original } = get();
    if (original) {
      set({ queue: original, index: Math.max(0, original.indexOf(queue[index])), original: null });
    } else {
      // songs you queued yourself keep their place; only the rest gets shuffled
      const fixed = index + 1 + queued;
      set({ original: queue, queue: [...queue.slice(0, fixed), ...shuffled(queue.slice(fixed))] });
    }
  },

  cycleRepeat: () => {
    const order: Repeat[] = ["off", "all", "one"];
    set({ repeat: order[(order.indexOf(get().repeat) + 1) % order.length] });
  },

  // "Play next" goes to the front of your queue, before the rest of the album or playlist
  playNext: (songs) => {
    const { index, queued, play } = get();
    if (index < 0) return play(songs);
    insert(index + 1, songs);
    set({ queued: queued + songs.length });
  },

  // "Add to queue" goes after songs you already queued, still before the rest of the album or playlist
  addToQueue: (songs) => {
    const { index, queued, play } = get();
    if (index < 0) return play(songs);
    insert(index + 1 + queued, songs);
    set({ queued: queued + songs.length });
  },

  jumpTo: (position) => {
    const { index, queued } = get();
    // moving forward uses up queued songs; moving back leaves them as ordinary upcoming songs
    set({ index: position, queued: position > index ? Math.max(0, queued - (position - index)) : 0 });
    load(get().queue[position]);
  },

  playFromHistory: (position) => {
    const { index, queued, history } = get();
    const song = history[position];
    if (index < 0) return get().play([song]);
    insert(index + 1, [song]);
    // count it as queued so jumping onto it doesn't use up one of your queued songs
    set({ queued: queued + 1 });
    get().jumpTo(index + 1);
  },

  removeFromQueue: (position) => {
    const { queue, index, queued, original } = get();
    if (position === index) return;
    const song = queue[position];
    set({
      queue: queue.filter((_, i) => i !== position),
      index: position < index ? index - 1 : index,
      queued: position > index && position <= index + queued ? queued - 1 : queued,
      original: original && original.filter((s) => s !== song),
    });
  },

  clearUpcoming: () => {
    const { queue, index, original } = get();
    const kept = queue.slice(0, index + 1);
    set({ queue: kept, queued: 0, original: original && original.filter((s) => kept.includes(s)) });
  },

  toggle: () => {
    if (get().index < 0) return;
    if (audio().paused) void audio().play();
    else audio().pause();
  },

  next: () => {
    const { queue, index, repeat } = get();
    if (index < queue.length - 1) return get().jumpTo(index + 1);
    if (repeat === "all" && queue.length) get().jumpTo(0);
  },

  previous: () => {
    const { index } = get();
    if (audio().currentTime > 3 || index <= 0) {
      audio().currentTime = 0;
      return;
    }
    get().jumpTo(index - 1);
  },

  seek: (time) => {
    audio().currentTime = time;
    set({ time });
  },

  setVolume: (volume) => {
    for (const deck of decks) deck.volume = volume;
    localStorage.setItem("volume", String(volume));
    set({ volume });
  },

  toggleMute: () => {
    const { volume, setVolume } = get();
    if (volume > 0) {
      unmutedVolume = volume;
      setVolume(0);
    } else {
      setVolume(unmutedVolume);
    }
  },

  stop: () => {
    for (const deck of decks) clear(deck);
    preloadedId = null;
    loaded = null;
    set({ queue: [], index: -1, queued: 0, original: null, source: null, history: [], time: 0, duration: 0 });
  },
}));

// inserts into the queue, and into the unshuffled order right after the same neighbour
function insert(position: number, songs: Song[]) {
  const { queue, original } = usePlayer.getState();
  const before = queue[position - 1];
  const at = original ? original.indexOf(before) + 1 : 0;
  usePlayer.setState({
    queue: [...queue.slice(0, position), ...songs, ...queue.slice(position)],
    original: original && [...original.slice(0, at), ...songs, ...original.slice(at)],
  });
}

export const useCurrentSong = () => usePlayer((state) => state.queue[state.index] as Song | undefined);

const HISTORY_LIMIT = 100;
let loaded: Song | null = null;
// whether the current play has been reported to the server as a listen
let submitted = false;

// a play counts after half the song or 4 minutes, whichever comes first (the Last.fm rule)
function submitPlay() {
  const { time, duration } = usePlayer.getState();
  if (submitted || !loaded || !duration || time < Math.min(duration / 2, 240)) return;
  submitted = true;
  void scrobble(loaded.id, true);
}

function clear(deck: HTMLAudioElement) {
  deck.pause();
  deck.removeAttribute("src");
  deck.load();
}

function load(song: Song) {
  if (loaded && loaded !== song) {
    const previous = loaded;
    usePlayer.setState((state) => ({ history: [...state.history, previous].slice(-HISTORY_LIMIT) }));
  }
  loaded = song;
  submitted = false;

  if (preloadedId === song.id) {
    audio().pause();
    active = 1 - active;
  } else {
    audio().src = streamUrl(song.id);
  }
  preloadedId = null;
  clear(spare());

  usePlayer.setState({ time: 0, duration: song.duration ?? 0 });
  void audio().play();
  void scrobble(song.id, false);
}

function upcomingSong() {
  const { queue, index, repeat } = usePlayer.getState();
  if (repeat === "one") return undefined;
  return queue[index + 1] ?? (repeat === "all" ? queue[0] : undefined);
}

// start loading the next song in the spare deck during the last 30 seconds
function preloadNext() {
  const { time, duration } = usePlayer.getState();
  const next = upcomingSong();

  if (preloadedId && preloadedId !== next?.id) {
    clear(spare());
    preloadedId = null;
  }
  if (!next || preloadedId || !duration || duration - time > 30) return;

  spare().preload = "auto";
  spare().src = streamUrl(next.id);
  preloadedId = next.id;
}

let lastPositionSave = 0;
const savePosition = () => localStorage.setItem(POSITION_KEY, String(audio().currentTime));

for (const deck of decks) {
  // the spare deck also fires events while preloading or after a swap; only the active deck counts
  const isActive = () => deck === audio();

  deck.addEventListener("play", () => isActive() && usePlayer.setState({ playing: true }));
  deck.addEventListener("pause", () => isActive() && usePlayer.setState({ playing: false }));
  deck.addEventListener("timeupdate", () => {
    if (!isActive()) return;
    usePlayer.setState({ time: deck.currentTime });
    submitPlay();
    preloadNext();
    if (Date.now() - lastPositionSave > 2000) {
      lastPositionSave = Date.now();
      savePosition();
    }
  });
  deck.addEventListener("durationchange", () => {
    // transcoded streams report Infinity, so keep the server-provided duration
    if (isActive() && Number.isFinite(deck.duration)) usePlayer.setState({ duration: deck.duration });
  });
  deck.addEventListener("ended", () => {
    if (!isActive()) return;
    const { repeat, next } = usePlayer.getState();
    if (repeat === "one") {
      submitted = false;
      deck.currentTime = 0;
      void deck.play();
      return;
    }
    next();
  });
}

window.addEventListener("pagehide", savePosition);

// save everything except the position (saved separately above) whenever the queue state changes
usePlayer.subscribe((state, previous) => {
  if (
    state.queue === previous.queue &&
    state.index === previous.index &&
    state.queued === previous.queued &&
    state.original === previous.original &&
    state.source === previous.source &&
    state.history === previous.history &&
    state.repeat === previous.repeat
  ) {
    return;
  }

  if (state.index < 0) {
    localStorage.removeItem(PLAYBACK_KEY);
    localStorage.removeItem(POSITION_KEY);
    return;
  }

  const playback: SavedPlayback = {
    queue: state.queue,
    index: state.index,
    queued: state.queued,
    original: state.original && state.original.map((song) => state.queue.indexOf(song)),
    source: state.source,
    history: state.history,
    repeat: state.repeat,
  };
  localStorage.setItem(PLAYBACK_KEY, JSON.stringify(playback));
});

// restore the last song paused at its saved position, without scrobbling it again
function restore() {
  const { queue, index } = usePlayer.getState();
  const song = queue[index];
  if (!song) return;

  const position = Number(localStorage.getItem(POSITION_KEY) ?? 0);
  loaded = song;
  // past the threshold means this listen was already reported before the restart
  submitted = !!song.duration && position >= Math.min(song.duration / 2, 240);
  audio().preload = "metadata";
  audio().src = streamUrl(song.id);
  audio().addEventListener("loadedmetadata", () => (audio().currentTime = position), { once: true });
  usePlayer.setState({ time: position, duration: song.duration ?? 0 });
}

restore();

// during development, editing this file replaces the module: hand playback over instead of stopping it
if (import.meta.hot) {
  if (import.meta.hot.data.playing) void audio().play();

  import.meta.hot.dispose((data) => {
    data.playing = !audio().paused;
    savePosition();
    window.removeEventListener("pagehide", savePosition);
    for (const deck of decks) clear(deck);
  });
}
