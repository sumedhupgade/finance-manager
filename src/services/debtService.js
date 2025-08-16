import axiosInstance from "../context/LoadingContext";
import { getAuthConfig } from "./userService";
const API_URL = process.env.REACT_APP_API_URL + "debt";
export const getDebts = async (year, month) => {
  try {
    const response = await axiosInstance.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw error;
  }
};

export const addDebt = async (data) => {
  try {
    const response = await axiosInstance.post(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw error;
  }
};

export const updateDebt = async (data) => {
  try {
    const response = await axiosInstance.put(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw error;
  }
};

export const deleteDebt = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting debt:", error);
    throw error;
  }
};
