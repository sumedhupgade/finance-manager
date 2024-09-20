import axiosInstance from '../context/LoadingContext'
const API_URL = process.env.REACT_APP_API_URL + "transactions";
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
export const getTransactions = async (year,month) => {
  try {
    const response = await axiosInstance.get(`${API_URL}?year=${year}&month=${month}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const addTransactions = async (data) => {
  try {
    const response = await axiosInstance.post(API_URL, data, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};