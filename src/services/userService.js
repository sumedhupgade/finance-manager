import axiosInstance from '../context/LoadingContext'
const API_URL = process.env.REACT_APP_API_URL + "user";
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching Users:", error);
    throw error;
  }
};
