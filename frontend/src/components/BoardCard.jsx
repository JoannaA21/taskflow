import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardList from "./BoardList"; // Import BoardList component

const BoardCard = () => {
  const boardAPI = "http://localhost:4000/api/boards/";
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  // const userId = loggedInUserInfo.details;

  // console.log("token", token);
  // console.log("userId", userId);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(boardAPI, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token for authentication
          },
        });
        setBoards(response.data); // Assuming the API response is an array of boards
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError("Failed to load boards. Please try again.");
      }
    };

    fetchBoards();
  }, [boardAPI, token]);

  return (
    <div>
      <h2>Boards</h2>
      {error && <p>{error}</p>}
      {boards.length > 0 ? (
        <BoardList boards={boards} />
      ) : (
        <p>No boards to display.</p>
      )}
    </div>
  );
};

export default BoardCard;
