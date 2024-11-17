import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const api = "http://localhost:4000/api/signup/";

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // Hook to navigate to a different route programmatically

  const [passwordCheck, setPasswordCheck] = useState("");
  //   const handleData = (e) => {
  //     const name = e.target.name
  //     const value  = e.target.value
  //     setUsers({...useSyncExternalStore, [name]: value})
  //   }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setPasswordCheck("Passwords do not match. Please try again.");
      return; //prevent sending request
    } else {
      setPasswordCheck("");
    }

    try {
      const response = await axios.post(api, user); //send user to the backend
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        console.log("Signup successful!", response.data);
        navigate("/login");
      } else {
        console.error("Signup failed:", response.data);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-white rounded-lg  p-8 max-w-lg w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create an Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Username
        </label>
        <input
          required
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white text-left">
          Email
        </label>
        <input
          required
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white text-left">
          Password
        </label>
        <input
          required
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">
          Confirm Password
        </label>
        <input
          required
          type="password"
          value={user.confirmPassword}
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <p className="text-red-700">{passwordCheck}</p>
        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Create Account
        </button>
      </form>

      <br />
      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?
        <span
          onClick={redirectToLogin}
          className="font-medium text-primary-600 hover:underline dark:text-mainColor cursor-pointer"
        >
          &nbsp; Login
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
