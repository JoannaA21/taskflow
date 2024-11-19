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
        console.log("response", response.data);
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
    return <p className="text-gray-600 italic">No tasks available</p>;
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
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`p-2 text-sm font-medium text-gray-800 rounded shadow ${getPriorityColor(
              task.priority
            )}`}
          >
            <h5>Task name: {task.title}</h5>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
