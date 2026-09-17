
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use(
  (config) => {

    // Get JWT token from sessionStorage
    const token = sessionStorage.getItem("token");

    console.log("JWT:", token);

    // If token exists, add it to Authorization header
    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

