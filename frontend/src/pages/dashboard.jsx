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
  const onOpenAddNewBoardModal = () => {
    setOnAddNewBoardModal(true); // Show the edit modal
  };

  return (
    <>
      <div className="flex max-w-[80rem] mx-auto items-center justify-between mt-32">
        <h1 className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl ml-10 md:ml-14 lg:ml-16 tracking-tight">
          Hi, {user}
        </h1>
        <button
          onClick={onOpenAddNewBoardModal}
          type="button"
          className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-3 lg:p-5 mr-3 lg:mr-10 text-white font-semibold text-sm sm:text-lg md:text-xl lg:text-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
        >
          +Add New Board
        </button>
      </div>

      <div className="mt-5">
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
