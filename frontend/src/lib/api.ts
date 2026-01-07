import API from "@/config/axios";

export const registerUser = async (userData: { email: string; password: string }) => {
  return API.post("/auth/register", userData);
};