import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BoardDetailsPage = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const { boardId } = useParams();
  const boardAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;
  const [boardDetails, setBoardDetails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const response = await axios.get(boardAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBoardDetails(response.data);
      } catch (err) {
        console.error("Error fetching board details:", err);
        setError("Failed to load board details. Please try again.");
      }
    };

    fetchBoardDetails();
  }, [boardAPI, token]);

  return (
    <div>
      <h1>Board Details Page</h1>
      {error && <p>{error}</p>}

      {boardDetails.length > 0 ? (
        <ul>
          {boardDetails.map((task) => (
            <li key={task._id}>
              <h1>{task.title}</h1>
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
