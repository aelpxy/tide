import { Dialog } from "@base-ui/react/dialog";
import { useState, type FormEvent } from "react";
import { button } from "../../lib/ui";
import { DialogShell } from "./dialog-shell";

export function NameDialog({
  open,
  onOpenChange,
  title,
  confirmLabel,
  initialName = "",
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmLabel: string;
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit(name.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={onOpenChange} title={title}>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
        <input
          required
          autoFocus
          aria-label="Name"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-lg border border-white/10 bg-elevated px-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
        />
        {error && <p className="text-[13px] text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <Dialog.Close className={button.secondary}>Cancel</Dialog.Close>
          <button type="submit" disabled={busy || !name.trim()} className={button.primary}>
            {confirmLabel}
          </button>
        </div>
      </form>
    </DialogShell>
  );
}
