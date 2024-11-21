import React from "react";
import BoardCard from "../components/BoardCard";
const Dashboard = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const user = loggedInUserInfo.details.username;
  return (
    <>
      <div className="pt-10 flex items-center justify-between mt-20">
        <h1 className="text-4xl font-bold text-gray-900 mx-auto">
          Welcome back, {user}
        </h1>
        <button
          type="button"
          className="cursor-pointer font-medium rounded-lg text-sm p-3 text-white bg-primary-500 hover:bg-purple-700"
        >
          Add New Board
        </button>
      </div>

      <div className="mt-20">
        <BoardCard />
      </div>
    </>
  );
};

export default Dashboard;
