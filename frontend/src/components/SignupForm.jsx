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

  const navigate = useNavigate();

  const [passwordCheck, setPasswordCheck] = useState("");
  //   const handleData = (e) => {
  //     const name = e.target.name
  //     const value  = e.target.value
  //     setUsers({...useSyncExternalStore, [name]: value})
  //   }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setPasswordCheck("Passwords fo not matCH. Please try again.");
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

  return (
    <div>
      <h1>Signup</h1>
      <p className="text-red-700">{passwordCheck}</p>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <label>Email</label>
        <input
          className="border-gray-900 border-solid"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={user.confirmPassword}
          onChange={(e) =>
            setUser({ ...user, confirmPassword: e.target.value })
          }
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupForm;
