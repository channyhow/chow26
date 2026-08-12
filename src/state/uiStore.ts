import { create } from "zustand";

export type DrawerView = "menu" | "contact" | "reservation";

export type OverlayState =
  | { type: "none" }
  | { type: "drawer"; view: DrawerView }
  | { type: "modal"; id: string };

type UIStore = {
  overlay: OverlayState;
  openDrawer: (view: DrawerView) => void;
  openModal: (id: string) => void;
  closeOverlay: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  overlay: { type: "none" },
  openDrawer: (view) => set({ overlay: { type: "drawer", view } }),
  openModal: (id) => set({ overlay: { type: "modal", id } }),
  closeOverlay: () => set({ overlay: { type: "none" } }),
}));

export const selectDrawerView = (state: UIStore): DrawerView | null =>
  state.overlay.type === "drawer" ? state.overlay.view : null;

export const selectOverlayOpen = (state: UIStore): boolean => state.overlay.type !== "none";
