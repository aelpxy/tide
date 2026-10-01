import { X } from "lucide-react";

export function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <button
        type="button"
        aria-label={`Hide ${title.toLowerCase()}`}
        onClick={onClose}
        className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-[color,background-color] duration-150 hover:bg-white/10 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
