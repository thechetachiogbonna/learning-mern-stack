import axios from "axios";

const options = {
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
};

const TokenFreshAPI = axios.create(options);

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && response.data?.errorCode === "InvalidAccessToken") {
      await TokenFreshAPI.get("/auth/refresh")
      return API(config);
    }
    return Promise.reject(error.response?.data || error.message);
  }
)

export default API;