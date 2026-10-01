use std::cell::RefCell;
use std::time::Duration;

use serde::Serialize;
use souvlaki::{
    MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, MediaPosition, PlatformConfig,
    SeekDirection,
};
use tauri::{AppHandle, Emitter};

use crate::now_playing::NowPlaying;

// the OS media objects aren't thread-safe, so they live on the main thread and every update runs there
thread_local! {
    static CONTROLS: RefCell<Option<MediaControls>> = const { RefCell::new(None) };
}

#[derive(Clone, Serialize)]
#[serde(tag = "action", rename_all = "camelCase")]
pub enum Control {
    Play,
    Pause,
    Toggle,
    Next,
    Previous,
    Stop,
    Seek { position: f64 },
    SeekBy { seconds: f64 },
}

pub fn emit(app: &AppHandle, control: Control) {
    let _ = app.emit("media-control", control);
}

fn to_control(event: MediaControlEvent) -> Option<Control> {
    let signed = |direction: SeekDirection, seconds: f64| match direction {
        SeekDirection::Forward => seconds,
        SeekDirection::Backward => -seconds,
    };

    Some(match event {
        MediaControlEvent::Play => Control::Play,
        MediaControlEvent::Pause => Control::Pause,
        MediaControlEvent::Toggle => Control::Toggle,
        MediaControlEvent::Next => Control::Next,
        MediaControlEvent::Previous => Control::Previous,
        MediaControlEvent::Stop => Control::Stop,
        MediaControlEvent::Seek(direction) => Control::SeekBy { seconds: signed(direction, 10.0) },
        MediaControlEvent::SeekBy(direction, amount) => Control::SeekBy {
            seconds: signed(direction, amount.as_secs_f64()),
        },
        MediaControlEvent::SetPosition(MediaPosition(position)) => Control::Seek {
            position: position.as_secs_f64(),
        },
        _ => return None,
    })
}

pub fn init(app: &AppHandle) {
    #[cfg(target_os = "windows")]
    let hwnd = {
        use tauri::Manager;
        match app.get_webview_window("main").and_then(|window| window.hwnd().ok()) {
            Some(hwnd) => Some(hwnd.0 as *mut std::ffi::c_void),
            None => return,
        }
    };
    #[cfg(not(target_os = "windows"))]
    let hwnd = None;

    let config = PlatformConfig { display_name: "Tide", dbus_name: "tide", hwnd };
    let mut controls = match MediaControls::new(config) {
        Ok(controls) => controls,
        Err(error) => {
            eprintln!("system media controls unavailable: {error:?}");
            return;
        }
    };

    let handle = app.clone();
    if let Err(error) = controls.attach(move |event| {
        if let Some(control) = to_control(event) {
            emit(&handle, control);
        }
    }) {
        eprintln!("couldn't attach system media controls: {error:?}");
        return;
    }

    CONTROLS.with(|cell| *cell.borrow_mut() = Some(controls));
}

pub fn update(app: &AppHandle, now_playing: Option<NowPlaying>) {
    let _ = app.run_on_main_thread(move || {
        CONTROLS.with(|cell| {
            let mut cell = cell.borrow_mut();
            let Some(controls) = cell.as_mut() else { return };

            let Some(np) = now_playing else {
                let _ = controls.set_metadata(MediaMetadata::default());
                let _ = controls.set_playback(MediaPlayback::Stopped);
                return;
            };

            let _ = controls.set_metadata(MediaMetadata {
                title: Some(&np.title),
                album: np.album.as_deref(),
                artist: np.artist.as_deref(),
                cover_url: np.cover_url.as_deref(),
                duration: Some(Duration::from_secs_f64(np.duration.max(0.0))),
            });

            let progress = Some(MediaPosition(Duration::from_secs_f64(np.position.max(0.0))));
            let _ = controls.set_playback(if np.playing {
                MediaPlayback::Playing { progress }
            } else {
                MediaPlayback::Paused { progress }
            });
        });
    });
}
