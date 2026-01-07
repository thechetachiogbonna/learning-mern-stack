import API from "@/config/axios";

export const registerUser = async (userData: { email: string; password: string, confirmPassword: string }) => {
  return API.post("/auth/register", userData);
};