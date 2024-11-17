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
      console.log(response.data);
      if (response.status === 200) {
        const userLoginInfo = {
          details: response.data.details.details,
          token: token,
        };

        localStorage.setItem("loggedIn", JSON.stringify(login)); // Store the token in localStorage
        navigate("/dashboard");
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
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username/Email</label>
        <input
          type="text"
          name="emailOrUsername"
          value={userLogin.emailOrUsername}
          onChange={handleInputChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userLogin.password}
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?
        <span onClick={redirectToSignup}>Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;
