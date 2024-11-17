import React, { useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const api = "http://localhost:4000/api/login";

  const [userLogin, setUserLogin] = useState({
    emailOrUsername: "",
    password: "",
  });

  //const navigate = useNavigate(); // Hook to navigate to a different route programmatically

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
    try {
      const response = await axios.post(api, userLogin);
      console.log(response.data);
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("jwt", token);
        // navigate("/dashboard");

        /*
        
        AUTHORIZATION CODE HERE!!!

        */
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
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
    </div>
  );
};

export default LoginForm;

//Need to do the authorization inn the frontend
