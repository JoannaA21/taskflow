import React from "react";
import page404 from "../assets/images/404_page.png";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-500">
      <img src={page404} alt="404 image" className="w-full max-w-4xl mb-6" />
      <button
        type="button"
        onClick={handleClick}
        className="px-6 py-2 text-primary-700 bg-primary-200 rounded hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Go back to my dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
