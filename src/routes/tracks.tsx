import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageTitle, TrackListSkeleton } from "../components/ui/skeletons";
import { TrackList } from "../components/library/track-list";
import { getSongs } from "../lib/subsonic";
import { button } from "../lib/ui";
import { EmptyState } from "../components/ui/empty-state";
import { Music } from "lucide-react";

const PAGE_SIZE = 500;

export const Route = createFileRoute("/tracks")({
  loader: () => getSongs(0, PAGE_SIZE),
  component: Tracks,
  pendingComponent: () => (
    <main className="px-8 pt-4 pb-10">
      <PageTitle eyebrow="My Collection" title="Tracks" />
      <TrackListSkeleton count={12} full />
    </main>
  ),
});

function Tracks() {
  const firstPage = Route.useLoaderData();
  const [more, setMore] = useState<typeof firstPage>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(firstPage.length < PAGE_SIZE);
  const songs = [...firstPage, ...more];

  const loadMore = async () => {
    setLoading(true);
    try {
      const page = await getSongs(songs.length, PAGE_SIZE);
      setMore((current) => [...current, ...page]);
      if (page.length < PAGE_SIZE) setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-8 pt-4 pb-10">
      <PageTitle eyebrow="My Collection" title="Tracks" />
      {songs.length === 0 ? (
        <EmptyState
          icon={Music}
          title="No tracks yet"
          description="Your server doesn’t have any songs, or hasn’t finished scanning your library."
        />
      ) : (
        <TrackList songs={songs} full source={{ type: "tracks", name: "Tracks" }} />
      )}
      {!done && (
        <div className="mt-6 flex justify-center">
          <button type="button" disabled={loading} onClick={() => void loadMore()} className={button.secondary}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </main>
  );
}
