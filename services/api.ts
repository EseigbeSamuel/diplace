import { checkTokenExpiry, clearAll, getFromLocalStore } from "@/lib";
import axios, { AxiosResponse, Method } from "axios";
import Toast from "react-native-toast-message";

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
      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please login again.",
        position: "top",
        visibilityTime: 2000,
        autoHide: true,
        swipeable: true,
      });

      clearAll();
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  const isFormData = payload instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

    return response.data;
  } catch (error: unknown) {
    // eslint-disable-next-line import/no-named-as-default-member
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: message,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Unexpected Error",
        text2: "Something went wrong. Please try again.",
        position: "top",
        visibilityTime: 2000,
      });
      console.error("Unknown error:", error);
    }

    throw error;
  }
};

export default apiService;
