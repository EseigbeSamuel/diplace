import Toast, { ToastShowParams } from "react-native-toast-message";

const DEFAULT_TOAST_OPTIONS: Pick<
  ToastShowParams,
  "autoHide" | "visibilityTime" | "position"
> = {
  autoHide: true,
  visibilityTime: 2500,
  position: "top",
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const showToast = (params: ToastShowParams) => {
  const merged = {
    ...DEFAULT_TOAST_OPTIONS,
    ...params,
  };

  Toast.hide();
  Toast.show(merged);

  if (hideTimer) {
    clearTimeout(hideTimer);
  }

  const visibilityTime = merged.visibilityTime ?? DEFAULT_TOAST_OPTIONS.visibilityTime ?? 2500;
  hideTimer = setTimeout(() => {
    Toast.hide();
    hideTimer = null;
  }, visibilityTime + 400);
};

export const hideToast = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  Toast.hide();
};
