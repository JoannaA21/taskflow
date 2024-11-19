import { useState, useEffect } from "react";
import axios from "axios";

const TaskList = ({ boardId }) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("LoggedIn"));
  const token = loggedInUserInfo.token;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/boards/${boardId}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [boardId, token]);

  return (
    <div>
      {tasks.map((task) => {
        <ul className="space-y-2">
          <li
            key={task._id}
            className="p-2 text-sm font-medium text-gray-800 bg-gray-100 rounded shadow"
          >
            <h5>{task.name}</h5>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>{task.priority}</p>
            <p>{task.dueDate}</p>
          </li>
          ;
        </ul>;
      })}
    </div>
  );
};

export default TaskList;
