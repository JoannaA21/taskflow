import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const BoardDetailsPage = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const { boardId } = useParams();

  // Updated API endpoint to include board details (assuming this is how the API responds)
  const boardAPI = `http://localhost:4000/api/boards/${boardId}`;
  const tasksAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;

  const [boardDetails, setBoardDetails] = useState(null); // Store board details
  const [tasks, setTasks] = useState([]); // Store tasks
  const [error, setError] = useState("");

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

        setBoardDetails(boardResponse.data); // Set board details (including name)
        setTasks(tasksResponse.data); // Set tasks
      } catch (err) {
        console.error("Error fetching board and tasks:", err);
        setError("Failed to load board details. Please try again.");
      }
    };

    fetchBoardAndTasks();
  }, [boardAPI, token]);

  return (
    <div>
      {boardDetails ? (
        <>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {boardDetails.name}
          </h1>{" "}
          {/* Display board name */}
          {/* <Link to={`/taskform/${boardId}`}>Add New Task</Link> */}
        </>
      ) : (
        <p>Loading board details...</p>
      )}

      {error && <p>{error}</p>}

      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <h2>{task.title}</h2>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(task.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found for this board.</p>
      )}
    </div>
  );
};

export default BoardDetailsPage;
