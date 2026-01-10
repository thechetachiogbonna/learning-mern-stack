import API from "@/config/axios";

export const registerUser = async (userData: { email: string; password: string, confirmPassword: string }) => {
  return API.post("/auth/register", userData);
};

export const loginUser = async (userData: { email: string; password: string }) => {
  return API.post("/auth/login", userData);
};

export const fetchCurrentUser = async () => {
  return API.get("/user");
}

export const getSessions = async () => {
  return API.get("/sessions") as Promise<{ sessions: Session[] }>;
};

export const revokeSession = async (sessionId: string) => {
  return API.delete(`/sessions/${sessionId}`);
};

export const requestPasswordReset = async (email: string) => {
  return API.post("/auth/password/forgot", { email });
}

export const resetPassword = async (data: { verificationCode: string; password: string }) => {
  return API.post("/auth/password/reset", data);
}