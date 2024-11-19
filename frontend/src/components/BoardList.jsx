import React from "react";

const BoardList = ({ boards }) => {
  return (
    <div>
      {boards.map((board) => (
        <div key={board._id} className="board-card">
          <h3>{board.name}</h3>
          <p>{board.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BoardList;
