import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const api = "http://localhost:4000/api/login";

  const [userLogin, setUserLogin] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate(); // Hook to navigate to a different route programmatically

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    try {
      const response = await axios.post(api, userLogin);
      let userLoginInfo;
      console.log(response.data);
      if (response.status === 200) {
        userLoginInfo = {
          details: response.data.details.details,
          token: response.data.details.token,
        };

        localStorage.setItem("loggedIn", JSON.stringify(userLoginInfo)); // Store the token in localStorage
        navigate("/dashboard"); //successful login redirects user to their dashboard
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  };

  const redirectToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-white rounded-lg  p-8 max-w-lg w-full">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Login</h1>

      {error && (
        <p className="text-red-700 text-md bg-red-200 p-1 w-fit">{error}</p>
      )}

      <br />

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Username/Email
        </label>
        <input
          type="text"
          name="emailOrUsername"
          value={userLogin.emailOrUsername}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={userLogin.password}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Login
        </button>
      </form>
      <br />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don't have an account?
        <span
          onClick={redirectToSignup}
          className="font-medium text-primary-600 hover:underline dark:text-mainColor cursor-pointer"
        >
          &nbsp;Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
