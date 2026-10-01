export const ease = [0.2, 0, 0, 1] as const;

export const spring = { type: "spring", stiffness: 400, damping: 40 } as const;

export const fade = { duration: 0.15, ease } as const;

export const slide = { duration: 0.2, ease } as const;

export const sheet = { type: "spring", stiffness: 320, damping: 36 } as const;
