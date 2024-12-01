import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardList from "./BoardList"; // Import BoardList component
import empty_dashboard from "../assets/images/empty_dashboard.png";

const BoardCard = () => {
  const boardAPI = "http://localhost:4000/api/boards/"; //fetch all boards
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;

  // const userId = loggedInUserInfo.details;

  // console.log("token", token);
  // console.log("userId", userId);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  //console.log("boards", boards);
  //console.log("id", boards[0]._id);

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
        setError("Failed to fetch boards. Please try again later."); // Set error message
        console.error("Error fetching boards:", err);
      }
    };

    fetchBoards();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-3">Oops!</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {boards.length > 0 ? (
        <>
          <BoardList boards={boards} setBoards={setBoards} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center  text-center">
          <h1 className="text-2xl font-bold mb-3">Let's get Started</h1>
          <p>Click on Add New Board to get started.</p>
          <img
            src={empty_dashboard}
            alt="Empty dashboard illustration"
            className="w-3/4 max-w-lg mb-3"
          />
          <p>You don't have any boards in your catalog yet.</p>
        </div>
      )}
    </>
  );
};

export default BoardCard;
