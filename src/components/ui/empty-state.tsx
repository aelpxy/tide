import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white/6 text-neutral-400 ring-1 ring-white/6">
        <Icon className="size-7" strokeWidth={1.5} />
      </span>
      <p className="mt-1 text-lg font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-neutral-400">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
