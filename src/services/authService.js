import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL + "auth/";

export const login = async (data) => {
  try {
    const user = await axios.post(API_URL + "login", {email:data.email,password: data.password});
    return user.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error.response.data;
  }
};

export const signUp = async (data) => {
  try {
    const user = await axios.post(API_URL + "signup", {email:data.email,password: data.password, username: data.name});
    return user.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error.response.data;
  }
};
