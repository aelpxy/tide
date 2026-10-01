mod discord;
mod media;
mod now_playing;
mod tray;

use std::sync::atomic::{AtomicBool, Ordering};

use tauri::{AppHandle, Manager, State, WindowEvent};

use discord::Discord;
use now_playing::NowPlaying;

struct CloseToTray(AtomicBool);

#[tauri::command]
async fn update_now_playing(app: AppHandle, now_playing: Option<NowPlaying>) {
    tray::update(&app, now_playing.as_ref());
    app.state::<Discord>().update(now_playing.as_ref());
    media::update(&app, now_playing);
}

#[tauri::command]
fn set_close_to_tray(state: State<CloseToTray>, enabled: bool) {
    state.0.store(enabled, Ordering::Relaxed);
}

#[tauri::command]
fn discord_available() -> bool {
    discord::available()
}

#[tauri::command]
async fn set_discord_enabled(state: State<'_, Discord>, enabled: bool) -> Result<(), ()> {
    state.set_enabled(enabled);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .manage(CloseToTray(AtomicBool::new(true)))
        .manage(Discord::default())
        .setup(|app| {
            media::init(app.handle());
            tray::init(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                if window.state::<CloseToTray>().0.load(Ordering::Relaxed) {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            update_now_playing,
            set_close_to_tray,
            discord_available,
            set_discord_enabled
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app, event| {
        // clicking the dock icon brings back a window hidden to the tray
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Reopen { .. } = event {
            tray::show_main(app);
        }
        #[cfg(not(target_os = "macos"))]
        let _ = (app, event);
    });
}
