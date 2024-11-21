import { useState, useEffect } from "react";
import axios from "axios";

const BoardForm = ({ onOpenAddNewBoardModal, onCloseAddNewBoardModal }) => {
  const boardAPI = "http://localhost:4000/api/boards/"; //Add new board api
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;

  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setNewBoard({
      ...newBoard,
      [name]: value,
    });
  };

  const addBoard = async (e) => {
    e.preventDefault();

    //ensures name field is filled out
    if (!newBoard.name) {
      setError("Name field must be field out");
      return;
    }

    try {
      await axios.post(boardAPI, newBoard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onCloseAddNewBoardModal();
    } catch (err) {
      err.response?.data?.message || "An error occurred creating a new task.";
    }
  };

  if (!onOpenAddNewBoardModal) return null;

  return (
    <div className=" fixed inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <form
        onSubmit={addBoard}
        className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full space-y-6"
      >
        {error && (
          <p className="text-red-700 text-md bg-red-200 p-2 w-fit">{error}</p>
        )}

        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Board Name
        </label>
        <input
          type="text"
          name="name"
          value={newBoard.name}
          onChange={handleOnChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={newBoard.description}
          onChange={handleOnChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <div className="flex justify-end space-x-4 mt-2">
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Add New Board
          </button>

          <button
            type="button"
            onClick={onCloseAddNewBoardModal}
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;
