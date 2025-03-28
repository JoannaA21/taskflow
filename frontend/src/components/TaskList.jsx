import { useState, useEffect } from "react";
import axios from "axios";

const TaskList = ({ boardId }) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        //console.log("Fetching tasks for boardId:", boardId); // Debugging log
        const response = await axios.get(
          `http://localhost:4000/api/boards/${boardId}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("response", response.data);
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [boardId, token]);

  if (!tasks || tasks.length === 0) {
    // Don't show anything if there are no tasks
    return (
      <p className="text-gray-600 italic">
        No tasks available. <br /> <br />
        <span className="hover:underline">
          Click on this card to add tasks.
        </span>
      </p>
    );
  }

  // Function to determine background color based on priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "bg-blue-200"; // Light blue background for low priority
      case "medium":
        return "bg-yellow-200"; // Light yellow background for medium priority
      case "high":
        return "bg-red-200"; // Light red background for high priority
      default:
        return "bg-gray-100"; // Default light gray background
    }
  };

  return (
    <div>
      {/* Display Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`p-2 text-sm md:text-base lg:text-2xl md:font-medium text-gray-800 rounded shadow ${getPriorityColor(
              task.priority
            )}`}
          >
            <p>
              <span className="italic font-bold">Task name: </span>
              {task.title}
            </p>
            <p>
              <span className="italic font-bold">Description: </span>
              {task.description}
            </p>
            <p>
              <span className="italic font-bold">Status: </span>
              {task.status}
            </p>
            <p>
              <span className="italic font-bold">Priority: </span>
              {task.priority}
            </p>
            <p>
              <span className="italic font-bold">Due Date: </span>
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
