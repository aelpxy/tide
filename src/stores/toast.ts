import { create } from "zustand";

export const useToast = create<{ message: string | null; id: number }>(() => ({ message: null, id: 0 }));

let timeout: ReturnType<typeof setTimeout> | undefined;

export function toast(message: string) {
  clearTimeout(timeout);
  useToast.setState((state) => ({ message, id: state.id + 1 }));
  timeout = setTimeout(() => useToast.setState({ message: null }), 2500);
}
