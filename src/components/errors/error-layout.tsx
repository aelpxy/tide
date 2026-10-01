import { motion } from "motion/react";
import { type ReactNode } from "react";
import { slide } from "../../lib/motion";

export function ErrorLayout({
  code,
  icon,
  title,
  description,
  children,
}: {
  code: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-8 pb-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={slide}
        className="flex max-w-md flex-col items-center"
      >
        <div className="relative mb-2 flex items-center justify-center">
          <span className="bg-linear-to-b from-white/20 to-white/0 bg-clip-text text-[10rem] leading-none font-black tracking-tighter text-transparent select-none">
            {code}
          </span>
          <span className="absolute flex size-16 items-center justify-center rounded-full bg-elevated text-icon shadow-2xl ring-1 ring-white/10">
            {icon}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-400">{description}</p>
        <div className="mt-8 flex gap-3">{children}</div>
      </motion.div>
    </main>
  );
}
