import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-date-picker";

const EditTaskModal = ({ taskId, boardId, onOpenModal, onCloseModal }) => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const token = loggedInUserInfo.token;
  const taskAPI = `http://localhost:4000/api/tasks/${taskId}`; //fetch by ID, and patch by Id

  const [error, setError] = useState("");

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: null,
  });

  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(taskAPI, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedTask = {
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
          priority: response.data.priority,
          dueDate: response.data.dueDate
            ? new Date(response.data.dueDate)
            : null, // Ensure this is a `Date` object or null
        };

        setTask(fetchedTask);
        setEditedTask(fetchedTask); // Initialize editedTask with fetched data
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task. Please try again.");
      }
    };
    fetchTask();
  }, [taskId]);

  const editTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(taskAPI, editedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // alert("Edited task successfully");
        // navigate(`/board/${boardId}`);
        window.location.reload();
        onCloseModal();
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  if (!onOpenModal) return null;

  return (
    <div className=" fixed inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <form
        className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full space-y-6"
        onSubmit={editTask}
      >
        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Task Title
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({
              ...task,
              title: e.target.value,
            })
          }
          placeholder={`${task.title}`}
        />

        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Description
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({
              ...task,
              description: e.target.value,
            })
          }
        />

        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Status
        </label>
        <select
          value={editedTask.status}
          onChange={(e) =>
            setEditedTask({
              ...task,
              status: e.target.value,
            })
          }
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          <option value="Todo">Todo</option>
          <option value="InProgress">InProgress</option>
          <option value="Done">Done</option>
        </select>

        <label className="block text-sm font-medium text-gray-900 dark:text-white text-left">
          Priority
        </label>
        <select
          value={editedTask.priority}
          onChange={(e) =>
            setEditedTask({
              ...task,
              priority: e.target.value,
            })
          }
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
          <DatePicker
            selected={editedTask.dueDate}
            onChange={(date) => setEditedTask({ ...editedTask, dueDate: date })}
            value={editedTask.dueDate}
            className="bg-white border border-gray-300 p-2 rounded-lg w-full"
            calendarClassName="z-10 bg-white" // Ensure the calendar stays on top of other elements
            clearIcon={null} // Hide clear icon if not needed
          />
        </div>

        <div className="flex justify-end space-x-4 mt-2">
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCloseModal}
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;
