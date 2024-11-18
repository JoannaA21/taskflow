import React from "react";
import LoginForm from "../components/LoginForm";
import Lottie from "lottie-react"; // Import Lottie
import animationData from "../assets/lottie/Animation-taskManagement - 1731885778267.json";

const LoginPage = () => {
  return (
    <div className="flex h-screen bg-primary-700">
      {/* Left side: Login Form  */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <LoginForm />
      </div>

      {/* Right side: Animation */}
      <div className="w-10/12 flex justify-center items-center bg-primary-700">
        <Lottie animationData={animationData} loop={true} className="w-3/4" />
      </div>
    </div>
  );
};

export default LoginPage;
