import { createRootRoute, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { Login } from "../components/auth/login";
import { NewPlaylistDialog } from "../components/playlists/new-playlist-dialog";
import { NowPlayingView } from "../components/now-playing/now-playing-view";
import { QueueDrawer } from "../components/now-playing/queue-drawer";
import { MiniPlayer } from "../components/player/mini-player";
import { PlayerBar } from "../components/player/player-bar";
import { Sidebar } from "../components/layout/sidebar";
import { TopBar } from "../components/layout/top-bar";
import { Toaster } from "../components/ui/toaster";
import { fade } from "../lib/motion";
import { useServer } from "../lib/subsonic";
import { useFavorites } from "../stores/favorites";
import { closeNowPlaying, useNowPlaying } from "../stores/now-playing";
import { refreshPlaylists } from "../stores/playlists";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const server = useServer((state) => state.server);
  const mini = useNowPlaying((state) => state.mini);

  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });
  const favoritesVersion = useFavorites((state) => state.version);

  useEffect(() => {
    if (server) void refreshPlaylists();
  }, [server]);

  useEffect(() => {
    if (favoritesVersion) void router.invalidate();
  }, [favoritesVersion, router]);

  useEffect(() => {
    closeNowPlaying();
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      {server && mini ? (
        <MiniPlayer />
      ) : server ? (
        <div className="relative h-screen overflow-clip bg-black text-white">
          <div className="flex h-full">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
            <div className="relative flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div id="content" data-scroll-restoration-id="content" className="flex-1 overflow-y-auto pt-14 pb-22">
                <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fade}>
                  <Outlet />
                </motion.div>
              </div>
            </div>
          </div>
          <NowPlayingView />
          <QueueDrawer />
          <PlayerBar />
          <NewPlaylistDialog />
          <Toaster />
        </div>
      ) : (
        <Login />
      )}
    </MotionConfig>
  );
}
