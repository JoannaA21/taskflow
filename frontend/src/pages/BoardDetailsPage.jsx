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

  // Status columns data
  const statusColumns = [
    { id: "todo", label: "To Do", color: "bg-red-50 border-red-200" },
    {
      id: "inprogress",
      label: "In Progress",
      color: "bg-blue-50 border-blue-200",
    },
    { id: "done", label: "Done", color: "bg-green-50 border-green-200" },
  ];

  // Fetch board details and tasks when the component loads
  useEffect(() => {
    const fetchBoardAndTasks = async () => {
      try {
        // Fetch board details
        // Fetch tasks for the board
        const [boardResponse, tasksResponse] = await Promise.all([
          axios.get(boardAPI, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(tasksAPI, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
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
        },
      );

      // Store deleted task in history with the user's info
      const deletedTask = response.data;

      // Attach the logged-in user's information locally
      const taskWithUserInfo = {
        ...deletedTask,
        deletedBy: loggedInUserInfo.details.username, // Add the logged-in user's username
        deletedAt: new Date().toISOString(), // Optionally, store when the task was deleted
      };

      // Add the deleted task to the history
      updatedHisotry = [...storedHistory, taskWithUserInfo];

      // Save the updated history back to localStorage
      localStorage.setItem("history", JSON.stringify(updatedHisotry));

      // Remove the task from the UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== selectedTaskId),
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
  const openAddNewTaskModal = () => {
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
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "📌";
      case "medium":
        return "⚡";
      case "high":
        return "🔥";
      default:
        return "📋";
    }
  };

  const formatDate = (dueDate) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Overdue";
    if (diffDays === 1) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status?.toLowerCase() === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-28 lg:pt-32">
      {" "}
      {/* Added pt-28 lg:pt-32 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Display board details */}
        {boardDetails ? (
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-800 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                  {boardDetails.name}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-2 max-w-2xl leading-relaxed">
                  {boardDetails.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0">
              <Link
                to="/history"
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-sm md:text-base font-semibold text-gray-800 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                📜 History
              </Link>
              <button
                type="button"
                onClick={openAddNewTaskModal}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-base md:text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white/20 backdrop-blur-sm"
              >
                + Add New Task
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-32 flex items-center justify-center">
            <p className="text-xl text-gray-600 animate-pulse">
              Loading board details...
            </p>
          </div>
        )}

        {/* Display error messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Display tasks */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {statusColumns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              return (
                <div
                  key={column.id}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <span
                      className={`w-3 h-3 rounded-full ${column.id === "todo" ? "bg-red-500" : column.id === "inprogress" ? "bg-blue-500" : "bg-green-500"}`}
                    />
                    <span>{column.label}</span>
                    <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                      {columnTasks.length}
                    </span>
                  </h3>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {columnTasks.map((task) => (
                      <div
                        key={task._id}
                        className={`group p-5 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-white ${column.color} ${
                          task.status?.toLowerCase() === "done"
                            ? "line-through opacity-60"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          {/* Priority Icon on the Left */}
                          <span className="text-2xl">
                            {getPriorityIcon(task.priority)}
                          </span>

                          {/* Action Icons Grouped on the Right */}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openEditModal(task._id)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-all"
                              title="Edit Task"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDeleteModal(task._id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100/50 rounded-lg transition-all"
                              title="Delete Task"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <h2 className="my-2 text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {task.title}
                        </h2>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-4">
                            <span className="italic font-semibold">
                              Description:
                            </span>
                            {task.description}
                          </p>
                        )}
                        <p className="text-sm">
                          <span className="italic font-semibold">Status:</span>{" "}
                          {task.status}
                        </p>
                        <p className="text-sm">
                          <span className="italic font-semibold">
                            Priority:
                          </span>{" "}
                          {task.priority}
                        </p>
                        <p className="text-sm">
                          <span className="italic font-semibold">
                            Due Date:
                          </span>{" "}
                          {formatDate(task.dueDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-3 text-center py-20">
            <img
              src={empty_boardDetail}
              alt="task illustration"
              className="w-1/2 max-w-sm mb-3 mx-auto opacity-60"
            />
            <p className="text-xl font-medium text-gray-700 mb-2">
              You don't have any tasks yet.
            </p>
            <p className="text-gray-500 mb-8">
              Click on Add New Task to get started.
            </p>
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
    </div>
  );
};

export default BoardDetailsPage;
