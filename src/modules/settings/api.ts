import api from "@/lib/axios";

export const getDisplaySettings = async () => {
  const response = await api.get(`/settings/display`);
  return response.data;
};

export const updateDisplaySettings = async ({
  theme,
  accent,
}: {
  theme: string;
  accent: string;
}) => {
  const response = await api.patch(`/settings/display`, { theme, accent });
  return response.data;
};
