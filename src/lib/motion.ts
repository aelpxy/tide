export const ease = [0.2, 0, 0, 1] as const;

export const spring = { type: "spring", stiffness: 400, damping: 40 } as const;

export const fade = { duration: 0.15, ease } as const;

export const slide = { duration: 0.2, ease } as const;

// the iOS sheet curve: quick start, clean settle with no long spring tail
const sheetEase = [0.32, 0.72, 0, 1] as const;

export const sheet = { duration: 0.4, ease: sheetEase } as const;

export const sheetExit = { duration: 0.3, ease: sheetEase } as const;
