import axiosInstance from "../utils/axiosInstance";

export const getProviderCountsByRole = async () => {
  const response = await axiosInstance.get(
    "/api/providers/counts-by-role"
  );

  return response.data;
};