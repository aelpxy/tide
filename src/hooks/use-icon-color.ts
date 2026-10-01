import { useState } from "react";

export const iconColors = [
  { id: "mono", label: "Mono", color: "#f2f2f2", on: "#0a0a0a" },
  { id: "tide", label: "Tide", color: "#ff5a4a", on: "#ffffff" },
  { id: "lime", label: "Lime", color: "#a6e22e", on: "#ffffff" },
  { id: "cyan", label: "Cyan", color: "#33ffee", on: "#ffffff" },
  { id: "blue", label: "Blue", color: "#0a84ff", on: "#ffffff" },
  { id: "purple", label: "Purple", color: "#bf5af2", on: "#ffffff" },
  { id: "pink", label: "Pink", color: "#ff375f", on: "#ffffff" },
  { id: "orange", label: "Orange", color: "#ff9f0a", on: "#ffffff" },
  { id: "yellow", label: "Yellow", color: "#ffd60a", on: "#ffffff" },
] as const;

export type IconColor = (typeof iconColors)[number];

export function useIconColor() {
  const [id, setId] = useState<string>(() => JSON.parse(localStorage.getItem("icon-color") ?? "null")?.id ?? "mono");

  const change = (value: string) => {
    const color = iconColors.find((c) => c.id === value) ?? iconColors[0];
    document.documentElement.style.setProperty("--icon-color", color.color);
    document.documentElement.style.setProperty("--icon-on-color", color.on);
    localStorage.setItem("icon-color", JSON.stringify(color));
    setId(color.id);
  };

  return { iconColor: id, setIconColor: change };
}
