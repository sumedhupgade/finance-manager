import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

console.log(axiosInstance);
// Loading Provider component
export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  // Function to increment the request counter
  const startLoading = () => setActiveRequests((prev) => prev + 1);

  // Function to decrement the request counter
  const stopLoading = () =>
    setActiveRequests((prev) => (prev > 0 ? prev - 1 : 0));

  // Calculate if the loader should be visible
  const isLoading = activeRequests > 0;
  useEffect(() => {
    // Setup Axios Interceptors inside the provider
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        startLoading(); // Increment the active request count
        return config;
      },
      (error) => {
        stopLoading(); // Decrement the active request count in case of error
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        stopLoading(); // Decrement the active request count
        return response;
      },
      (error) => {
        stopLoading(); // Decrement the active request count in case of error
        return Promise.reject(error);
      }
    );

    // Clean up the interceptors when the component unmounts
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default axiosInstance;