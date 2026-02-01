const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const API_BASE_URL = requireEnv('VITE_API_BASE_URL');
export const INGEST_APP_PATH = requireEnv('VITE_INGEST_APP_PATH');
export const REFRESH_APP_PATH = requireEnv('VITE_REFRESH_APP_PATH');
export const INGEST_ALL_PATH = requireEnv('VITE_INGEST_ALL_PATH');
