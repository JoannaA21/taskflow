import { useState } from "react";
import BoardCard from "../components/BoardCard";
import BoardForm from "../components/BoardForm";

const Dashboard = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const user = loggedInUserInfo.details.username;

  const [onAddNewBoardModal, setOnAddNewBoardModal] = useState(false); //Toggle for add new board modal visibility

  // Function to close the Add New Board modal
  const onCloseAddNewBoardModal = () => {
    setOnAddNewBoardModal(false);
  };

  // Open the edit modal for a specific task
  const onOpenAddNewBoardModal = (taskId) => {
    setOnAddNewBoardModal(true); // Show the edit modal
  };

  return (
    <>
      <div className="pt-10 flex items-center justify-between mt-20">
        <h1 className="text-4xl font-bold text-gray-900 mx-auto">
          Welcome back, {user}
        </h1>
        <button
          onClick={onOpenAddNewBoardModal}
          type="button"
          className="cursor-pointer font-medium rounded-lg text-sm p-3 text-white bg-primary-500 hover:bg-purple-700"
        >
          Add New Board
        </button>
      </div>

      <div className="mt-20">
        <BoardCard />
      </div>

      {onAddNewBoardModal && (
        <BoardForm
          onOpenAddNewBoardModal={onOpenAddNewBoardModal}
          onCloseAddNewBoardModal={onCloseAddNewBoardModal}
        />
      )}
    </>
  );
};

export default Dashboard;
