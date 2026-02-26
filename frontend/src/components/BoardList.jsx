import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TaskList from "./TaskList";
import { Link } from "react-router-dom";
import DeleteBoardModal from "./DeleteBoardModal";

const BoardList = ({ boards, setBoards }) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const containerRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [onDeleteModal, setOnDeleteModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [error, setError] = useState("");
  const [taskCount, setTaskCount] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const fetchTasks = async (boardId) => {
    setIsLoadingTasks(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/boards/${boardId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.length !== 0) {
        setTaskCount(true);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleScroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth;
    if (direction === "left" && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (
      direction === "right" &&
      scrollIndex < Math.ceil(boards.length / 5) - 1
    ) {
      setScrollIndex(scrollIndex + 1);
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const confirmDeleteBoard = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/boards/${selectedBoardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBoards((prevBoards) =>
        prevBoards.filter((board) => board._id !== selectedBoardId),
      );

      setSelectedBoardId(null);
      onCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting board:", err);
      setError("Failed to delete the board. Please try again.");
    }
  };

  const onOpenDeleteModal = (boardId) => {
    setOnDeleteModal(true);
    setSelectedBoardId(boardId);
    fetchTasks(boardId);
  };

  const onCloseDeleteModal = () => {
    setOnDeleteModal(false);
    setSelectedBoardId(null);
    setTaskCount(false);
  };

  return (
    <div className="relative max-w-[80rem] mx-auto w-full px-10 md:px-12 py-5 lg:px-16">
      {/* Error Notification */}
      {error && (
        <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-md">
          <p className="text-sm sm:text-base">{error}</p>
          <button
            onClick={() => setError("")}
            className="text-primary-600 mt-2 text-sm hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Left Arrow */}
      {scrollIndex > 0 && (
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg hover:bg-gray-400"
          onClick={() => handleScroll("left")}
        >
          &lt;
        </button>
      )}

      {/* Board Container */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {boards?.map((board) => {
          return (
            <div
              key={board._id}
              className="mt-4 w-full border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transition duration-200"
            >
              {/* Colored Top Section */}
              <div
                className="p-4 rounded-t-lg flex flex-col justify-center bg-primary-100"
                style={{ height: "170px" }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                  {board.name}
                </h3>
                <p className="mt-2 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                  {board.description}
                </p>

                {/* SVG Icon positioned in the top-right corner */}
                <div className="flex justify-end space-x-4 mt-2">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 dark:text-white cursor-pointer hover:opacity-75 transition-opacity"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    onClick={() => onOpenDeleteModal(board._id)}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                    />
                  </svg>
                </div>
              </div>

              <Link
                to={`/board/${board._id}`}
                className="block max-h-full overflow-hidden hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {/* White Task Section */}
                <div className="bg-white p-4 rounded-b-lg max-h-[30rem] sm:max-h-[40rem] md:max-h-[50rem] lg:max-h-[60rem] overflow-y-auto">
                  <TaskList boardId={board._id} />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Conditionally render the Delete Modal */}
      {onDeleteModal && !isLoadingTasks && (
        <DeleteBoardModal
          taskCount={taskCount}
          onCloseDeleteModal={onCloseDeleteModal}
          confirmDeleteBoard={confirmDeleteBoard}
        />
      )}

      {onDeleteModal && isLoadingTasks && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-80 sm:w-96 md:w-[28rem] p-8 rounded-lg shadow-xl text-center">
            <p className="mb-6 text-lg font-medium text-gray-900">
              Checking tasks...
            </p>
          </div>
        </div>
      )}

      {/* Right Arrow */}
      {scrollIndex < Math.ceil(boards.length / 5) - 1 && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg md:hidden hover:bg-gray-400"
          onClick={() => handleScroll("right")}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default BoardList;
