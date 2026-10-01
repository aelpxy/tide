import { type ReactNode } from "react";

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-neutral-500 uppercase">{title}</h2>
      <div className="divide-y divide-white/6 rounded-lg bg-surface px-5">{children}</div>
    </section>
  );
}
