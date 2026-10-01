const pill =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background-color,scale] duration-150 ease-out active:scale-97 disabled:pointer-events-none disabled:opacity-40";

export const button = {
  primary: `${pill} bg-white text-black hover:scale-103`,
  secondary: `${pill} bg-white/10 text-white hover:bg-white/15`,
  danger: `${pill} bg-red-500 text-white hover:bg-red-400`,
  icon: "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,scale] duration-150 ease-out hover:bg-white/15 active:scale-94",
};

export const popover =
  "rounded-lg bg-elevated/90 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0";

export const cardImage = "transition-transform duration-300 ease-out group-hover:scale-104";
