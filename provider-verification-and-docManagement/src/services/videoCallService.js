import axiosInstance from "../utils/axiosInstance";

export const getAllVideoCalls = async () => {
  const response = await axiosInstance.get(
    "/api/video-calls"
  );

  return response.data;
};

export const joinVideoCall = async (videoCallId) => {
  const response = await axiosInstance.post(
    `/api/video-calls/${videoCallId}/join`
  );

  return response.data;
};