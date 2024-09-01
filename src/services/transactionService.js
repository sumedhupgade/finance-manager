import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL + "transactions";
export const getTransactions = async () => {
    console.log(process.env.REACT_APP_STAGE);
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const addTransactions = async (data) => {
  try {
    const response = await axios.post(API_URL,data);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };