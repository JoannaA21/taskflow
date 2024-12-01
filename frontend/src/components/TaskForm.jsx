import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TaskForm = ({
  tasks,
  setTasks,
  onOpenAddNewTaskModal,
  onCloseAddNewTaskModal,
}) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const { boardId } = useParams();
  const createTaskInBoardAPI = `http://localhost:4000/api/boards/${boardId}/tasks`;

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    dueDate: null,
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.title) {
      setError("Title field must be field out.");
      return;
    }

    if (!newTask.dueDate) {
      setError("Due date field must be field out.");
      return;
    }

    if (new Date(newTask.dueDate).getTime() < Date.now()) {
      setError("The due date cannot be earlier than today.");
      return;
    }

    try {
      const response = await axios.post(createTaskInBoardAPI, newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if (response.status === 200) {
      // }
      setTasks([...tasks, response.data]);

      onCloseAddNewTaskModal();
      // console.log("Added successfully");
    } catch (err) {
      err.response?.data?.message || "An error occurred creating a new task.";
    }
  };

  if (!onOpenAddNewTaskModal) return null;

  return (
    <>
      <div className=" fixed inset-0 z-20 bg-gray-400 bg-opacity-30 backdrop-blur-sm flex justify-center items-center max-w-[80rem] mx-auto">
        <form
          className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full space-y-6"
          onSubmit={addTask}
        >
          {error && (
            <p className="text-red-700 text-md bg-red-200 p-2 w-fit">{error}</p>
          )}

          <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
            Task Title
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
            Description
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
          />

          <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
            Status
          </label>
          <select
            value={newTask.status}
            name="status"
            onChange={handleInputChange}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
            Priority
          </label>
          <select
            value={newTask.priority}
            name="priority"
            onChange={handleInputChange}
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
            Due Date
          </label>
          <div className="relative">
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-2">
            <button
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Add New Task
            </button>

            <button
              type="button"
              onClick={onCloseAddNewTaskModal}
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TaskForm;
