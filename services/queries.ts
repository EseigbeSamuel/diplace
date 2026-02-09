import { apiService } from "./api";

export const refreshToken = (refresh: string) => {
  return apiService("/core/token/refresh/", "POST", { refresh }, false);
};

export const getRequest = async <
  TResponse,
  TParams extends Record<string, string | number | boolean> = Record<
    string,
    string | number | boolean
  >,
>({
  url,
  params,
  protectedRoute = true,
}: {
  url: string;
  params?: TParams;
  protectedRoute?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse>(
    url,
    "GET",
    undefined,
    protectedRoute,
    params,
  );
};

export const getRequestWithParams = async <TResponse>({
  url,
  params,
  protectedRoute = true,
}: {
  url: string;
  params?: Record<string, string | number | boolean>;
  protectedRoute?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse>(
    url,
    "GET",
    undefined,
    protectedRoute,
    params,
    {},
  );
};

export const postRequest = async <TResponse, TRequest>({
  url,
  payload,
  protectedRoute = true,
}: {
  url: string;
  payload: TRequest;
  protectedRoute?: boolean;
}): Promise<TResponse> => {
  console.log("payload", payload);
  return await apiService<TResponse, TRequest>(
    url,
    "POST",
    payload,
    protectedRoute,
  );
};

export const patchRequest = async <TResponse, TRequest>({
  url,
  payload,
  protectedRoute = true,
}: {
  url: string;
  payload: TRequest;
  protectedRoute?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse, TRequest>(
    url,
    "PATCH",
    payload,
    protectedRoute,
  );
};

export const deleteRequest = async <TResponse>({
  url,
  protectedRoute = true,
}: {
  url: string;
  protectedRoute?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse>(url, "DELETE", undefined, protectedRoute);
};
