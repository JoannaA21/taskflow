import { useState, useEffect } from "react";

const NewBoardForm = ({}) => {
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
  });

  handleOnChange = (e) => {};

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleOnChange} />
      </form>
    </div>
  );
};

export default NewBoardForm;
