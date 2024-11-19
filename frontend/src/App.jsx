import { useState, useEffect } from "react";
// import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BoardDetailsPage from "./pages/BoardDetailsPage";

function App() {
  const [boardList, setBoardList] = useState([]);

  // const apiUserLoggedIn = `http://localhost:4000/api/users/${id}`;
  // const apiBoardList = `http://localhost:4000/api/boards/${id}`;

  useEffect(() => {}, [boardList]);

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board/:boardId" element={<BoardDetailsPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
