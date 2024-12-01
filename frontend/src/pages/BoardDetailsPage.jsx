import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import TaskForm from "../components/TaskForm";
import empty_boardDetail from "../assets/images/empty_boardDetails.png";

const BoardDetailsPage = () => {
  // Retrieve the logged-in user's information from localStorage
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token; // Extract the user's token for API requests
  const { boardId } = useParams(); // Get the boardId from the URL parameters

  //For history page
  // Retrieve existing history from local storage
  const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
  let updatedHisotry = [];

  const boardAPI = `http://localhost:4000/api/boards/${boardId}`;
  const tasksAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;

  const [boardDetails, setBoardDetails] = useState({}); // Store board details
  const [tasks, setTasks] = useState([]); // Store tasks associated with the board
  const [error, setError] = useState(""); // Store error messages
  const [onEditModal, setOnEditModal] = useState(false); // Toggle for edit modal visibility
  const [onDeleteModal, setOnDeleteModal] = useState(false); // Toggle for delete modal visibility
  const [onAddNewTaskModal, setOnAddNewTaskModal] = useState(false); //Toggle for add new task modal visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Store the ID of the selected task

  // Fetch board details and tasks when the component loads
  useEffect(() => {
    const fetchBoardAndTasks = async () => {
      try {
        // Fetch board details
        const boardResponse = await axios.get(boardAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch tasks for the board
        const tasksResponse = await axios.get(tasksAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBoardDetails(boardResponse.data);
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error("Error fetching board and tasks:", err);
        setError("Failed to load board details. Please try again.");
      }
    };

    fetchBoardAndTasks();
  }, [boardAPI, tasksAPI, token]);

  // Confirm and delete a task
  const confirmDeleteTask = async () => {
    try {
      // Make DELETE request to the API
      const response = await axios.delete(
        `http://localhost:4000/api/tasks/${selectedTaskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store deleted task in history with the user's info
      const deletedTask = response.data;

      // Attach the logged-in user’s information locally
      const taskWithUserInfo = {
        ...deletedTask,
        deletedBy: loggedInUserInfo.details.username, // Add the logged-in user’s username
        deletedAt: new Date().toISOString(), // Optionally, store when the task was deleted
      };

      // Add the deleted task to the history
      updatedHisotry = [...storedHistory, taskWithUserInfo];

      // Save the updated history back to localStorage
      localStorage.setItem("history", JSON.stringify(updatedHisotry));

      // Remove the task from the UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTaskId)
      );

      onCloseDeleteModal(); // Close the delete modal
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete the task. Please try again.");
    }
  };

  // Open the edit modal for a specific task
  const openEditModal = (taskId) => {
    setSelectedTaskId(taskId); // Set the selected task ID
    setOnEditModal(true); // Show the edit modal
  };

  // Open the edit modal for a specific task
  const openAddNewTaskModal = (taskId) => {
    setSelectedTaskId(taskId); // Set the selected task ID
    setOnAddNewTaskModal(true); // Show the edit modal
  };

  // Open the delete modal for a specific task
  const handleDeleteModal = (taskId) => {
    setSelectedTaskId(taskId); // Set the selected task ID
    setOnDeleteModal(true); // Show the delete modal
  };

  // Function to close the edit modal
  const onCloseEditModal = () => {
    setOnEditModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

  // Function to close the Add New Task modal
  const onCloseAddNewTaskModal = () => {
    setOnAddNewTaskModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

  // Function to close the delete modal
  const onCloseDeleteModal = () => {
    setOnDeleteModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

  //Ensure UI updates reflect without having to reload the entire page
  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  // Function to get the background color for task priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-blue-200"; // Blue for low priority
      case "medium":
        return "bg-yellow-200"; // Yellow for medium priority
      case "high":
        return "bg-red-200"; // Red for high priority
      default:
        return "bg-gray-100"; // Default gray for unknown priorities
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "todo":
        return (
          <svg
            className="h-8 w-8 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      case "done":
        return (
          <svg
            className="h-8 w-8 text-green-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="12" cy="12" r="9" /> <path d="M9 12l2 2l4 -4" />
          </svg>
        );
      default:
        return (
          <svg
            className="h-8 w-8 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
          </svg>
        );
    }
  };

  return (
    <div className="">
      {/* Display board details */}
      {boardDetails ? (
        <div className=" max-w-[80rem] mx-auto pt-10 flex items-center justify-between mt-20 md:mb-10 lg:mb-20">
          <h1 className="text-2xl md:text-4xl lg:text-6xl text-primary-700 font-bold ml-5">
            {boardDetails.name}
          </h1>
          <Link to="/history" className="ml-auto mt-0 order-none mr-3">
            <p className="cursor-pointer font-normal md:text-2xl lg:text-3xl hover:underline hover:text-primary-700 text-gray-500 italic">
              View History
            </p>
          </Link>

          <button
            type="button"
            onClick={openAddNewTaskModal}
            className="cursor-pointer rounded-lg p-2 md:p-5 mr-3 md:mr-10  text-white bg-primary-500 hover:bg-purple-700"
          >
            <span className="font-normal text-sm sm:text-lg md:text-2xl lg:text-3xl">
              +Add New Task{" "}
            </span>
          </button>
        </div>
      ) : (
        <p>Loading board details...</p>
      )}

      {/* Display error messages */}
      {error && <p>{error}</p>}

      {/* Display tasks */}
      {tasks.length > 0 ? (
        <ul className=" max-w-[80rem] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 m-5">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`relative p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transition duration-200 ${getPriorityColor(
                task.priority
              )} ${getStatusIcon(task.status)}
              ${
                task.status.toLowerCase() === "done"
                  ? "line-through opacity-50"
                  : ""
              }
              `}
            >
              {/* <div className="absolute top-2 right-2"> */}
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                {getStatusIcon(task.status)}
              </div>

              <div>
                <h2 className="mb-2 text-lg md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {task.title}
                </h2>
              </div>
              {task.description && (
                <p>
                  <span className="italic font-semibold">Description:</span>
                  {task.description}
                </p>
              )}
              <p>
                <span className="italic font-semibold">Status:</span>{" "}
                {task.status}
              </p>
              <p>
                <span className="italic font-semibold">Priority:</span>{" "}
                {task.priority}
              </p>
              <p>
                <span className="italic font-semibold">Due Date:</span>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>

              <div className="flex justify-end space-x-4 mt-2">
                {/* Edit task icon */}
                <svg
                  className="w-6 h-6 dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => openEditModal(task._id)}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
                </svg>

                {/* Delete task icon */}
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => handleDeleteModal(task._id)}
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
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center mt-3 text-center">
          <img
            src={empty_boardDetail}
            alt="task illustration"
            className="w-1/2 max-w-sm mb-3"
          />
          <p>Click on Add New Task to get started.</p>

          <p>You don't have any tasks yet.</p>
        </div>
      )}

      {/* Conditionally render the EditTaskModal */}
      {onEditModal && selectedTaskId && (
        <EditTaskModal
          onEditModal={onEditModal}
          onCloseEditModal={onCloseEditModal}
          taskId={selectedTaskId}
          onUpdateTask={handleTaskUpdate}
        />
      )}

      {/* Conditionally render the Delete Modal */}
      {onDeleteModal && (
        <DeleteTaskModal
          onCloseDeleteModal={onCloseDeleteModal}
          confirmDeleteTask={confirmDeleteTask}
        />
      )}

      {/* Conditionally render the Add New Task Modal */}
      {onAddNewTaskModal && (
        <TaskForm
          onOpenAddNewTaskModal={onAddNewTaskModal}
          onCloseAddNewTaskModal={onCloseAddNewTaskModal}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default BoardDetailsPage;
