import axiosInstance from "../context/LoadingContext";
import { getAuthConfig } from "./userService";
const API_URL = process.env.REACT_APP_API_URL + "portfolio"

export const getHoldings = async (year,month) => {
    try {
      const response = await axiosInstance.get(`${API_URL}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error("Error fetching holdings:", error);
      throw error;
    }
  };