const env = import.meta.env;

const { VITE_LANGUAGE, VITE_FRONTEND_URL, VITE_BACKEND_URL } = env;

export const config = {
  env: {
    VITE_LANGUAGE,
    VITE_FRONTEND_URL,
    VITE_BACKEND_URL,
  },
};
