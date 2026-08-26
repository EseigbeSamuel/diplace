import { checkTokenExpiry, clearAll, getFromLocalStore, showToast } from "@/lib";
import axios, { AxiosResponse, Method } from "axios";

let lastToastMessage = "";
let lastToastAt = 0;

const showApiToast = (text1: string, text2: string) => {
  const now = Date.now();
  // Prevent rapid toast churn from concurrent failing requests.
  if (now - lastToastAt < 1200) {
    return;
  }

  // Prevent identical toasts from stacking in quick succession.
  if (lastToastMessage === `${text1}:${text2}` && now - lastToastAt < 4000) {
    return;
  }

  lastToastMessage = `${text1}:${text2}`;
  lastToastAt = now;

  showToast({
    type: "error",
    text1,
    text2,
  });
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
  notifyOnError?: boolean,
): Promise<TResponse> => {
  const token = await getFromLocalStore("access_token");
  const shouldNotify =
    notifyOnError ?? String(method).toUpperCase() !== "GET";

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
    if (shouldNotify) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        let message: string;
        if (Array.isArray(detail)) {
          message = detail.map((d: any) => d?.msg || String(d)).join("\n");
        } else if (typeof detail === "string") {
          message = detail;
        } else if (detail && typeof detail === "object") {
          message = JSON.stringify(detail);
        } else {
          message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong";
        }

        showApiToast("Request Failed", message);
      } else {
        showApiToast("Unexpected Error", "Something went wrong. Please try again.");
        console.error("Unknown error:", error);
      }
    }

    throw error;
  }
};

export default apiService;
