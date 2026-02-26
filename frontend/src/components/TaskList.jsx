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
        const response = await axios.get(
          `http://localhost:4000/api/boards/${boardId}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [boardId, token]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-4xl mb-4 text-gray-300">📝</div>
        <p className="text-sm sm:text-base text-gray-500 italic">
          No tasks yet. Click to add your first task!
        </p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "ring-2 ring-blue-300 bg-blue-50 border-blue-200";
      case "medium":
        return "ring-2 ring-yellow-300 bg-yellow-50 border-yellow-200";
      case "high":
        return "ring-2 ring-red-300 bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
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

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return "Overdue";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 max-h-[400px] overflow-y-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs sm:text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Task Counter */}
      <div className="mb-4 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
        <span className="text-xs sm:text-sm font-medium text-gray-700">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tasks Grid - Show max 4 tasks as preview */}
      <div className="grid grid-cols-1 gap-3">
        {tasks.slice(0, 4).map((task) => (
          <div
            key={task._id}
            className={`p-3 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 truncate ${getPriorityColor(task.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg mt-0.5 flex-shrink-0">
                {getPriorityIcon(task.priority)}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate mb-1">
                  {task.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      new Date(task.dueDate) < new Date()
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Indicator */}
      {tasks.length > 4 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <div className="text-xs sm:text-sm text-primary-600 font-medium hover:underline cursor-pointer">
            +{tasks.length - 4} more tasks...
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
