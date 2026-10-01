import { useState, type FormEvent } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { slide } from "../../lib/motion";
import { createServer, findServer, ping, setServer } from "../../lib/subsonic";
import { button } from "../../lib/ui";
import { WindowControls } from "../layout/window-controls";
import logo from "../../../logo.svg";

const input =
  "h-11 w-full rounded-lg border border-white/10 bg-elevated px-4 text-[15px] text-white outline-none placeholder:text-neutral-500 focus:border-white/30";

const submit = `${button.primary} mt-2 w-full`;

export function Login() {
  const router = useRouter();
  const navigate = useNavigate();
  const [step, setStep] = useState<"server" | "account">("server");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (event: FormEvent, action: () => Promise<void>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const continueToAccount = (event: FormEvent) =>
    run(event, async () => {
      setUrl(await findServer(address));
      setStep("account");
    });

  const signIn = (event: FormEvent) =>
    run(event, async () => {
      const server = createServer(url, username, password);
      await ping(server);
      setServer(server);
      await navigate({ to: "/" });
      await router.invalidate();
    });

  const back = () => {
    setError("");
    setPassword("");
    setStep("server");
  };

  return (
    <div className="relative flex h-screen flex-col bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in srgb, var(--icon) 14%, transparent), transparent 60%)",
        }}
      />
      <div data-tauri-drag-region className="relative flex h-14 shrink-0 justify-end">
        <WindowControls />
      </div>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-14">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3">
            <img src={logo} alt="" className="size-11" />
            <p className="text-3xl leading-none font-bold tracking-tight">Tide</p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {step === "server" ? (
              <motion.form
                key="server"
                onSubmit={continueToAccount}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={slide}
                className="flex flex-col gap-3"
              >
                <h1 className="text-3xl font-bold tracking-tight">Connect to your server</h1>
                <p className="mb-3 text-sm text-neutral-400">Enter the address of your Navidrome or Subsonic server.</p>
                <input
                  required
                  autoFocus
                  aria-label="Server address"
                  placeholder="music.example.com"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={input}
                />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <button type="submit" disabled={busy} className={submit}>
                  {busy ? "Connecting…" : "Continue"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="account"
                onSubmit={signIn}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={slide}
                className="flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={back}
                  className="mb-1 flex w-fit items-center gap-1.5 text-[13px] text-neutral-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-3.5" />
                  {new URL(url).host}
                </button>
                <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
                <p className="mb-3 text-sm text-neutral-400">Use your account on this server.</p>
                <input
                  required
                  autoFocus
                  aria-label="Username"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={input}
                />
                <input
                  required
                  type="password"
                  aria-label="Password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={input}
                />
                {error && <p className="text-[13px] text-red-400">{error}</p>}
                <button type="submit" disabled={busy} className={submit}>
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-1.5">
            <span
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${step === "server" ? "w-5 bg-white" : "w-1.5 bg-white/25"}`}
            />
            <span
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out ${step === "account" ? "w-5 bg-white" : "w-1.5 bg-white/25"}`}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
