import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupForm from "./components/SignupForm";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </Router>
        <SignupForm />
      </div>
    </>
  );
}

export default App;
