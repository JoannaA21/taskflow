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
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-700 ml-10 md:ml-14 lg:ml-16">
          Hi, {user}
        </h1>
        <button
          onClick={onOpenAddNewBoardModal}
          type="button"
          className="cursor-pointer rounded-lg p-2 lg:p-5 mr-3 lg:mr-10  text-white bg-primary-500 hover:bg-purple-700"
        >
          <span className="font-normal text-sm sm:text-lg md:text-xl lg:text-2xl">
            +Add New Board
          </span>
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
