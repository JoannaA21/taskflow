import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditTaskModal from "../components/EditTaskModal";

const BoardDetailsPage = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const { boardId } = useParams();

  // API endpoints
  const boardAPI = `http://localhost:4000/api/boards/${boardId}`;
  const tasksAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;

  const [boardDetails, setBoardDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [onOpenModal, setOnOpenModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const onCloseModal = () => {
    setOnOpenModal(false);
    setSelectedTaskId(null); // Reset selected task when closing the modal
  };

  useEffect(() => {
    const fetchBoardAndTasks = async () => {
      try {
        const boardResponse = await axios.get(boardAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
  }, [boardAPI, token]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-blue-200";
      case "medium":
        return "bg-yellow-200";
      case "high":
        return "bg-red-200";
      default:
        return "bg-gray-100";
    }
  };

  const openEditModal = (taskId) => {
    setSelectedTaskId(taskId);
    setOnOpenModal(true); // Open the modal when clicking edit icon
  };

  return (
    <div>
      {boardDetails ? (
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            {boardDetails.name}
          </h1>
        </div>
      ) : (
        <p>Loading board details...</p>
      )}

      {error && <p>{error}</p>}

      {tasks.length > 0 ? (
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
              <div className="flex justify-end space-x-4 mt-2">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => openEditModal(task._id)} // Open modal with the selected task
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
                </svg>

                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                  />
                </svg>
                {/* Other SVGs (e.g., delete or additional actions) */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found for this board.</p>
      )}

      {/* Conditionally render the EditTaskModal */}
      {onOpenModal && selectedTaskId && (
        <EditTaskModal
          taskId={selectedTaskId}
          boardId={boardId}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
        />
      )}
    </div>
  );
};

export default BoardDetailsPage;
