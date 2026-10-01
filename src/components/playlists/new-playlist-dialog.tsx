import { useNavigate, useRouter } from "@tanstack/react-router";
import { createPlaylist } from "../../lib/subsonic";
import { closeNewPlaylist, refreshPlaylists, usePlaylists } from "../../stores/playlists";
import { toast } from "../../stores/toast";
import { NameDialog } from "../ui/name-dialog";

export function NewPlaylistDialog() {
  const router = useRouter();
  const navigate = useNavigate();
  const songIds = usePlaylists((state) => state.pendingSongIds);

  const create = async (name: string) => {
    const playlist = await createPlaylist(name, songIds ?? []);
    await refreshPlaylists();
    await router.invalidate();

    if (songIds?.length) {
      toast(`Added to ${name}`);
    } else if (playlist) {
      await navigate({ to: "/playlists/$playlistId", params: { playlistId: playlist.id } });
    }
  };

  return (
    <NameDialog
      // remount per request so the name field starts empty
      key={String(songIds)}
      open={songIds !== null}
      onOpenChange={(open) => !open && closeNewPlaylist()}
      title="New playlist"
      confirmLabel="Create"
      onSubmit={create}
    />
  );
}
