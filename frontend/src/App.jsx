import { useState, useEffect } from "react";
// import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/common/Nav";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BoardDetailsPage from "./pages/BoardDetailsPage";
import TaskForm from "./components/TaskForm";
import BoardForm from "./components/BoardForm";
import NotFoundPage from "./pages/NotFoundPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<Nav />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/board/:boardId" element={<BoardDetailsPage />} />
              <Route path="/taskform/:boardId" element={<TaskForm />} />
              <Route path="/boardform" element={<BoardForm />} />
              <Route path="history" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
