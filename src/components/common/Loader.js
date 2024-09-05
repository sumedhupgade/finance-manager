import React from "react";
import { useLoading } from "../../context/LoadingContext";
const Loader = () => {
  const { isLoading } = useLoading();
  return (
    isLoading && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    )
  );
};

export default Loader;