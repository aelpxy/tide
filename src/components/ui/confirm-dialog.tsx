import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import { button } from "../../lib/ui";
import { DialogShell } from "./dialog-shell";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DialogShell open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="mt-6 flex justify-end gap-2">
        <Dialog.Close className={button.secondary}>Cancel</Dialog.Close>
        <button type="button" disabled={busy} onClick={confirm} className={button.danger}>
          {confirmLabel}
        </button>
      </div>
    </DialogShell>
  );
}
