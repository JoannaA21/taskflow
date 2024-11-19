import { useState, useEffect } from "react";
import axios from "axios";

const NewBoardForm = () => {
  const api = "http://localhost:4000/api/boards/";
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.details.token;
  console.log(token);

  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setNewBoard({
      ...newBoard,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newBoard.name} onChange={handleOnChange} />
        <input
          type="text"
          value={newBoard.description}
          onChange={handleOnChange}
        />
        <button type="submit">Create New Board</button>
      </form>
    </div>
  );
};

export default NewBoardForm;
