import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardList from "./BoardList"; // Import BoardList component
import empty_dashboard from "../assets/images/empty_dashboard.png";

const BoardCard = ({ boards, setBoards }) => {
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
