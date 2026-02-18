const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (process.env.NODE_ENV === "test") return value || "";

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT");
export const MONGO_URI = getEnv("MONGO_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_USER = getEnv("EMAIL_USER");
export const EMAIL_PASSWORD = getEnv("EMAIL_PASSWORD");