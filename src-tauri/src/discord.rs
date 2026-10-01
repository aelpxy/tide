use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use discord_rich_presence::activity::{Activity, ActivityType, Assets, StatusDisplayType, Timestamps};
use discord_rich_presence::{DiscordIpc, DiscordIpcClient};

use crate::now_playing::NowPlaying;

// application ID https://discord.com/developers/applications
const CLIENT_ID: &str = "";

#[derive(Default)]
pub struct Discord {
    enabled: AtomicBool,
    client: Mutex<Option<DiscordIpcClient>>,
    last: Mutex<Option<NowPlaying>>,
}

pub fn available() -> bool {
    !CLIENT_ID.is_empty()
}

impl Discord {
    pub fn set_enabled(&self, enabled: bool) {
        self.enabled.store(enabled, Ordering::Relaxed);
        if enabled {
            let last = self.last.lock().unwrap().clone();
            self.show(last.as_ref());
        } else if let Some(mut client) = self.client.lock().unwrap().take() {
            let _ = client.clear_activity();
            let _ = client.close();
        }
    }

    pub fn update(&self, now_playing: Option<&NowPlaying>) {
        *self.last.lock().unwrap() = now_playing.cloned();
        if self.enabled.load(Ordering::Relaxed) {
            self.show(now_playing);
        }
    }

    fn show(&self, now_playing: Option<&NowPlaying>) {
        if !available() {
            return;
        }

        let mut guard = self.client.lock().unwrap();
        if guard.is_none() {
            let mut client = DiscordIpcClient::new(CLIENT_ID);
            if client.connect().is_err() {
                return;
            }
            *guard = Some(client);
        }
        let Some(client) = guard.as_mut() else { return };

        let result = match now_playing.filter(|np| np.playing) {
            Some(np) => {
                let now = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs_f64()).unwrap_or_default();
                let start = (now - np.position) as i64;
                let state = np.artist.as_deref().map(|artist| format!("by {artist}"));
                let mut activity = Activity::new()
                    .activity_type(ActivityType::Listening)
                    .status_display_type(StatusDisplayType::Details)
                    .details(np.title.as_str())
                    .timestamps(Timestamps::new().start(start).end(start + np.duration as i64))
                    .assets(Assets::new().large_image("tide").large_text(np.album.as_deref().unwrap_or("Tide")));
                if let Some(state) = state.as_deref() {
                    activity = activity.state(state);
                }
                client.set_activity(activity)
            }
            None => client.clear_activity(),
        };

        if result.is_err() {
            *guard = None;
        }
    }
}
