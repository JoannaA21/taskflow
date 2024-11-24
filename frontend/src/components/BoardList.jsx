import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TaskList from "./TaskList";
import { Link } from "react-router-dom";
import DeleteBoardModal from "./DeleteBoardModal";

const BoardList = ({ boards, setBoards }) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const containerRef = useRef(null); // Reference for the container
  const [scrollIndex, setScrollIndex] = useState(0); // Current scroll index
  const [onDeleteModal, setOnDeleteModal] = useState(false); // Toggle for delete modal visibility
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [error, setError] = useState("");
  const [taskCount, setTaskCount] = useState(false); //number of tasks
  const [isLoadingTasks, setIsLoadingTasks] = useState(false); // New loading state

  const fetchTasks = async (boardId) => {
    setIsLoadingTasks(true); // Start loading

    try {
      const response = await axios.get(
        `http://localhost:4000/api/boards/${boardId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length !== 0) {
        setTaskCount(true);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoadingTasks(false); // Stop loading
    }
  };

  const handleScroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth; // Width of the visible container
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
        }
      );

      //Remove the board from the UI
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board._id !== selectedBoardId)
      );

      setSelectedBoardId(null);
      onCloseDeleteModal(); // Close the delete modal
    } catch {
      console.error("Error deleting board:", err);
      setError("Failed to delete the board. Please try again."); // Handle errors
    }
  };

  //Function to open the delete modal
  const onOpenDeleteModal = (boardId) => {
    setOnDeleteModal(true);
    setSelectedBoardId(boardId);
    fetchTasks(boardId);
  };

  // Function to close the delete modal
  const onCloseDeleteModal = () => {
    setOnDeleteModal(false);
    setSelectedBoardId(null);
    setTaskCount(false);
  };

  return (
    <div className="relative w-full px-4 md:px-12">
      {/* Left Arrow */}
      {scrollIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg"
          onClick={() => handleScroll("left")}
        >
          &lt;
        </button>
      )}

      {/* Board Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-scroll scroll-smooth no-scrollbar space-x-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {boards?.map((board, index) => {
          const hue = (index * 137) % 360; // Dynamic color
          const backgroundColor = `hsl(${hue}, 70%, 80%)`;

          return (
            <div
              key={board._id}
              className="flex-shrink-0 mt-10 w-1/5 max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transition duration-200 "
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Colored Top Section */}
              <div
                className="p-4 rounded-t-lg flex flex-col justify-center "
                style={{ backgroundColor, height: "170px" }}
              >
                <h3 className="text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                  {board.name}
                </h3>
                <p className="mt-2 text-gray-700">{board.description}</p>

                {/* SVG Icon positioned in the top-right corner */}
                <div className="flex justify-end space-x-4 mt-2">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer "
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

              <Link to={`/board/${board._id}`} key={board._id}>
                {/* White Task Section */}
                <div className="bg-white min-w-[150px] p-4 rounded-b-lg">
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
          <div className="bg-white w-96 md:w-[28rem] p-8 rounded-lg shadow-lg text-center">
            <p className="mb-6 text-lg font-medium">Checking tasks...</p>
          </div>
        </div>
      )}

      {/* Right Arrow */}
      {scrollIndex < Math.ceil(boards.length / 5) - 1 && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg"
          onClick={() => handleScroll("right")}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default BoardList;
