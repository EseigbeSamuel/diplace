import { create } from "zustand";

export type AppToastParams = {
  type?: "success" | "info" | "warning" | "danger" | "error" | "default";
  text1?: string;
  text2?: string;
  autoHide?: boolean;
  visibilityTime?: number;
  position?: "top" | "center" | "bottom";
};

const DEFAULT_TOAST_OPTIONS: Pick<
  AppToastParams,
  "autoHide" | "visibilityTime" | "position"
> = {
  autoHide: true,
  visibilityTime: 2500,
  position: "top",
};

const normalizeType = (type?: AppToastParams["type"]) => {
  if (!type) return "info";
  if (type === "error") return "danger";
  return type;
};

type ToastState = {
  visible: boolean;
  text1: string;
  text2?: string;
  type: ReturnType<typeof normalizeType>;
  position: "top" | "center" | "bottom";
};

type ToastStore = {
  toast: ToastState;
  setToast: (toast: Partial<ToastState>) => void;
  hide: () => void;
};

const initialToast: ToastState = {
  visible: false,
  text1: "",
  text2: undefined,
  type: "info",
  position: "top",
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastStore>((set) => ({
  toast: initialToast,
  setToast: (toast) =>
    set((state) => ({
      toast: {
        ...state.toast,
        ...toast,
      },
    })),
  hide: () =>
    set((state) => ({
      toast: {
        ...state.toast,
        visible: false,
      },
    })),
}));

export const showToast = (params: AppToastParams) => {
  const merged = {
    ...DEFAULT_TOAST_OPTIONS,
    ...params,
  };

  const duration = merged.visibilityTime ?? DEFAULT_TOAST_OPTIONS.visibilityTime;

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }

  useToastStore.getState().setToast({
    visible: true,
    text1: merged.text1 || "",
    text2: merged.text2,
    type: normalizeType(merged.type),
    position: merged.position,
  });

  if (merged.autoHide !== false) {
    hideTimer = setTimeout(() => {
      useToastStore.getState().hide();
      hideTimer = null;
    }, duration);
  }
};

export const hideToast = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  useToastStore.getState().hide();
};
