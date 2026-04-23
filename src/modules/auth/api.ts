import api from "@/lib/axios";

export const register = async (registerData: {
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

export const login = async (loginData: {
  username: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const refreshSession = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};
