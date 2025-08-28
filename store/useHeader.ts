// src/store/useHeaderStore.ts
import { ReactNode } from "react";
import { create } from "zustand";

type HeaderState = {
  title: {
    type: "string" | "node";
    value: string | ReactNode;
  };
  setTitle: (title: string | ReactNode) => void;
  clearTitle: () => void;
};

export const useHeaderStore = create<HeaderState>((set) => ({
  title: { type: "string", value: "" },
  setTitle: (title) =>
    set({
      title:
        typeof title === "string"
          ? { type: "string", value: title }
          : { type: "node", value: title },
    }),
  clearTitle: () => set({ title: { type: "string", value: "" } }),
}));
