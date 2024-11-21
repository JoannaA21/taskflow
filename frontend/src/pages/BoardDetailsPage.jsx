import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";
import TaskForm from "../components/TaskForm";

const BoardDetailsPage = () => {
  // Retrieve the logged-in user's information from localStorage
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token; // Extract the user's token for API requests
  const { boardId } = useParams(); // Get the boardId from the URL parameters

  const boardAPI = `http://localhost:4000/api/boards/${boardId}`;
  const tasksAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;

  const [boardDetails, setBoardDetails] = useState(null); // Store board details
  const [tasks, setTasks] = useState([]); // Store tasks associated with the board
  const [error, setError] = useState(""); // Store error messages
  const [onEditModal, setOnEditModal] = useState(false); // Toggle for edit modal visibility
  const [onDeleteModal, setOnDeleteModal] = useState(false); // Toggle for delete modal visibility
  const [onAddNewTaskModal, setOnAddNewTaskModal] = useState(false); //Toggle for add new task modal visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Store the ID of the selected task

  // Function to close the edit modal
  const onCloseEditModal = () => {
    setOnEditModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

  // Function to close the delete modal
  const onCloseDeleteModal = () => {
    setOnDeleteModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

  // Function to close the Add New Task modal
  const onCloseAddNewTaskModal = () => {
    setOnAddNewTaskModal(false);
    setSelectedTaskId(null); // Reset the selected task when closing the modal
  };

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

        setBoardDetails(boardResponse.data); // Update state with board details
        setTasks(tasksResponse.data); // Update state with tasks
      } catch (err) {
        console.log("What is wrong now???");
        console.error("Error fetching board and tasks:", err);
        setError("Failed to load board details. Please try again."); // Handle errors
      }
    };

    fetchBoardAndTasks();
  }, [boardAPI, token]); // Dependencies: boardAPI and token

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

  // Confirm and delete a task
  const confirmDeleteTask = async () => {
    try {
      // Make DELETE request to the API
      await axios.delete(`http://localhost:4000/api/tasks/${selectedTaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the task from the UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTaskId)
      );
      onCloseDeleteModal(); // Close the delete modal
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete the task. Please try again."); // Handle errors
    }
  };

  return (
    <div>
      {/* Display board details */}
      {boardDetails ? (
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            {boardDetails.name}
          </h1>
          <p onClick={openAddNewTaskModal} className="cursor-pointer">
            Add New Task
          </p>
        </div>
      ) : (
        <p>Loading board details...</p>
      )}

      {/* Display error messages */}
      {error && <p>{error}</p>}

      {/* Display tasks */}
      {tasks.length > 0 ? (
        <div className="task-list-container overflow-auto h-full">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${getPriorityColor(
                  task.priority
                )}`}
              >
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {task.title}
                </h2>
                {task.description && <p>Description: {task.description}</p>}
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <p>Due Date: {task.dueDate}</p>
                <div className="flex justify-end space-x-4 mt-2">
                  {/* Edit task icon */}
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
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
        </div>
      ) : (
        <p>No tasks found for this board.</p>
      )}

      {/* Conditionally render the EditTaskModal */}
      {onEditModal && selectedTaskId && (
        <EditTaskModal
          taskId={selectedTaskId}
          boardId={boardId}
          onEditModal={onEditModal}
          onCloseEditModal={onCloseEditModal}
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
