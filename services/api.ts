import { checkTokenExpiry, clearAll, getFromLocalStore } from "@/lib";
import axios, { AxiosResponse, Method } from "axios";
import Toast from "react-native-toast-message";

let lastToastMessage = "";
let lastToastAt = 0;
let hideToastTimer: ReturnType<typeof setTimeout> | null = null;

const showApiToast = (text1: string, text2: string) => {
  const now = Date.now();
  // Prevent identical toasts from stacking in quick succession.
  if (lastToastMessage === `${text1}:${text2}` && now - lastToastAt < 1500) {
    return;
  }

  lastToastMessage = `${text1}:${text2}`;
  lastToastAt = now;

  Toast.hide();
  Toast.show({
    type: "error",
    text1,
    text2,
    position: "top",
    visibilityTime: 2500,
    autoHide: true,
  });

  if (hideToastTimer) {
    clearTimeout(hideToastTimer);
  }
  hideToastTimer = setTimeout(() => {
    Toast.hide();
    hideToastTimer = null;
  }, 2800);
};

export const apiService = async <TResponse, TRequest = undefined>(
  url: string,
  method: Method,
  payload?: TRequest,
  protectedRoute: boolean = false,
  params?: Record<string, string | number | boolean>,
  headers: Record<string, string> = {},
  baseURL: string = "https://diplace.api.elsoft.ng/api/v1",
  responseType: "json" | "blob" = "json",
): Promise<TResponse> => {
  const token = await getFromLocalStore("access_token");

  if (protectedRoute && token) {
    if (await checkTokenExpiry(token)) {
      showApiToast("Session Expired", "Please login again.");
      clearAll();
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  const isFormData = payload instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };

  try {
    const response: AxiosResponse<TResponse> = await axios({
      method,
      url,
      data: payload,
      baseURL,
      headers: finalHeaders,
      params,
      responseType,
    });

    console.log("API Response:", response.data);

    return response.data;
  } catch (error: unknown) {
    // Log full axios error context to help diagnose network issues
    if (axios.isAxiosError(error)) {
      console.log("error in service first", {
        message: error.message,
        code: error.code,
        name: error.name,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        timeout: error.config?.timeout,
        responseStatus: error.response?.status,
        responseData: error.response?.data,
      });
    } else {
      console.log("error in service first", error);
    }
    // eslint-disable-next-line import/no-named-as-default-member
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

      showApiToast("Request Failed", message);
    } else {
      showApiToast("Unexpected Error", "Something went wrong. Please try again.");
      console.error("Unknown error:", error);
    }

    throw error;
  }
};

export default apiService;
