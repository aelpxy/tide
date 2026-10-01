<p align="center">
  <img src="logo.svg" alt="Tide logo" width="96" />
</p>

# Tide

Tide is a desktop music player for your own library. Connect it to a Subsonic-compatible server, such as Navidrome, and listen to the music you already have.

## Connect your library

You'll need a Subsonic-compatible music server and an account on it before you start.

1. Open Tide and enter your server address, for example `https://music.example.com`. If your server lives under a path like `/music`, include that too. Leave off `/rest`.
2. Click **Continue** and enter your server username and password.
3. Click **Sign in**. Your library is ready to browse.

You can enter just a hostname too. Tide will try HTTPS first, then HTTP. To switch accounts or servers, sign out under **Settings → Server**.

Some features depend on your server. Lower streaming qualities need transcoding support, and lyrics and artist details only appear when your server provides them. Tide uses Subsonic API `1.16.1` and OpenSubsonic structured lyrics. The full track list relies on an empty `search3` query, which some servers don't support.

## Development

### Run locally

You'll need Node.js 24, pnpm, Rust, and Cargo. Install the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for your operating system as well.

From the repository root:

```sh
pnpm install
pnpm tauri dev
```

This starts the Vite development server and opens Tide. Use the desktop app when working with server requests or native features.

### Build

```sh
pnpm tauri build
```

This builds and packages Tide for your current platform. You'll find the bundles in `src-tauri/target/release/bundle/`.

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Start the frontend development server   |
| `pnpm build`       | Check TypeScript and build the frontend |
| `pnpm preview`     | Preview the built frontend              |
| `pnpm tauri dev`   | Run the desktop app in development      |
| `pnpm tauri build` | Build and package the desktop app       |

The frontend is built with React, TanStack Router, TanStack Query, Zustand, and Tailwind CSS. Tauri and Rust handle the desktop shell and native integrations.

### Discord Rich Presence

To enable Discord Rich Presence in your own build, set `CLIENT_ID` in `src-tauri/src/discord.rs` to your Discord application ID and rebuild Tide. Then turn on **Show on Discord** under **Settings → Desktop** with Discord running. The ID is empty by default, so the integration stays disabled until you set it.

## Keyboard shortcuts

Use **Cmd** in place of **Ctrl** on macOS.

| Shortcut     | Action                             |
| ------------ | ---------------------------------- |
| Space        | Play or pause                      |
| ← / →        | Seek backward or forward 5 seconds |
| Ctrl + ← / → | Previous or next track             |
| Ctrl + ↑ / ↓ | Increase or decrease volume        |
| M            | Mute or unmute                     |
| Ctrl + K     | Focus search                       |

Shortcuts stay out of the way while you're typing. Playback keys also leave focused buttons and other interactive controls alone.

## License

[MIT](LICENSE)
