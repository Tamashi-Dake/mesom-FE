const env = import.meta.env;

const { VITE_LANGUAGE, VITE_FRONTEND_URL, VITE_BACKEND_URL, VITE_ENV } = env;

export const config = {
  env: {
    VITE_ENV,
    VITE_LANGUAGE,
    VITE_FRONTEND_URL,
    VITE_BACKEND_URL,
  },
};
