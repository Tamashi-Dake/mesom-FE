import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 10000,
});

// Centralised response error handling.
// 401 is intentionally NOT redirected here — the authProvider's useEffect
// handles auth redirects via React Router (soft navigation, no page reload).
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status;
    const message: string =
      error.response?.data?.message || error.message || "An error occurred";

    if (status === 403) {
      toast.error(message || "Access forbidden");
    } else if (status !== undefined && status >= 500) {
      toast.error("Server error, please try again later");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
