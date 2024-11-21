import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react"; // Import Lottie
import animationData from "../../assets/lottie/Animation-taskManagement - 1731885778267.json";

const Nav = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const user = loggedInUserInfo.details.username;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link
          to="/dashboard"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Lottie animationData={animationData} loop={true} className="h-14" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Task Management
          </span>
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Welcome back, {user}
          </p>
          <p
            className="text-gray-500 cursor-pointer hover:text-purple-700"
            onClick={logout}
          >
            Logout
          </p>
        </div>
        <Outlet /> {/* This is where the routed content will go */}
      </div>
    </nav>
  );
};

export default Nav;
