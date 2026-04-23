import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import queryClient from "./queryClient";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 10000,
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry) {
      const url = original.url ?? "";
      if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (isRefreshing) return Promise.reject(error);

      original._retry = true;
      isRefreshing = true;
      try {
        await axiosInstance.post("/auth/refresh");
        return axiosInstance(original);
      } catch (refreshError) {
        queryClient.clear();
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message: string =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An error occurred";

    if (status === 403) {
      toast.error(message || "Access forbidden");
    } else if (status !== undefined && status >= 500) {
      toast.error("Server error, please try again later");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
