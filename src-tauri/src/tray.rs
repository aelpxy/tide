use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, Wry};

use crate::media::{emit, Control};
use crate::now_playing::NowPlaying;

pub struct Tray {
    icon: TrayIcon,
    play_pause: MenuItem<Wry>,
}

pub fn show_main(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

pub fn init(app: &AppHandle) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "Show Tide", true, None::<&str>)?;
    let play_pause = MenuItem::with_id(app, "play-pause", "Play", true, None::<&str>)?;
    let next = MenuItem::with_id(app, "next", "Next", true, None::<&str>)?;
    let previous = MenuItem::with_id(app, "previous", "Previous", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit Tide", true, None::<&str>)?;
    let menu = Menu::with_items(
        app,
        &[
            &show,
            &PredefinedMenuItem::separator(app)?,
            &play_pause,
            &next,
            &previous,
            &PredefinedMenuItem::separator(app)?,
            &quit,
        ],
    )?;

    let mut builder = TrayIconBuilder::with_id("main")
        .tooltip("Tide")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            "show" => show_main(app),
            "play-pause" => emit(app, Control::Toggle),
            "next" => emit(app, Control::Next),
            "previous" => emit(app, Control::Previous),
            "quit" => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                show_main(tray.app_handle());
            }
        });

    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }

    let icon = builder.build(app)?;
    app.manage(Tray { icon, play_pause });
    Ok(())
}

pub fn update(app: &AppHandle, now_playing: Option<&NowPlaying>) {
    let tray = app.state::<Tray>();
    let tooltip = match now_playing {
        Some(np) => match &np.artist {
            Some(artist) => format!("{} — {}", np.title, artist),
            None => np.title.clone(),
        },
        None => "Tide".into(),
    };
    let _ = tray.icon.set_tooltip(Some(tooltip));
    let playing = now_playing.is_some_and(|np| np.playing);
    let _ = tray.play_pause.set_text(if playing { "Pause" } else { "Play" });
}
