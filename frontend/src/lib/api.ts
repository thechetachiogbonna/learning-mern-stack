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