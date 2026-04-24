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
  headers,
  notifyOnError,
}: {
  url: string;
  payload: TRequest;
  protectedRoute?: boolean;
  headers?: Record<string, string>;
  notifyOnError?: boolean;
}): Promise<TResponse> => {

  return await apiService<TResponse, TRequest>(
    url,
    "POST",
    payload,
    protectedRoute,
    undefined,
    headers,
    undefined,
    "json",
    notifyOnError,
  );
};

export const patchRequest = async <TResponse, TRequest>({
  url,
  payload,
  protectedRoute = true,
  notifyOnError,
}: {
  url: string;
  payload: TRequest;
  protectedRoute?: boolean;
  notifyOnError?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse, TRequest>(
    url,
    "PATCH",
    payload,
    protectedRoute,
    undefined,
    {},
    undefined,
    "json",
    notifyOnError,
  );
};

export const putRequest = async <TResponse, TRequest>({
  url,
  payload,
  protectedRoute = true,
  notifyOnError,
}: {
  url: string;
  payload: TRequest;
  protectedRoute?: boolean;
  notifyOnError?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse, TRequest>(
    url,
    "PUT",
    payload,
    protectedRoute,
    undefined,
    {},
    undefined,
    "json",
    notifyOnError,
  );
};

export const deleteRequest = async <TResponse>({
  url,
  protectedRoute = true,
  notifyOnError,
}: {
  url: string;
  protectedRoute?: boolean;
  notifyOnError?: boolean;
}): Promise<TResponse> => {
  return await apiService<TResponse>(
    url,
    "DELETE",
    undefined,
    protectedRoute,
    undefined,
    {},
    undefined,
    "json",
    notifyOnError,
  );
};
