import { useState } from "react";

const HistoryPage = () => {
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const storedHistory = JSON.parse(localStorage.getItem("history")) || [];

  // Get the current date
  const currentDate = new Date();

  const userHistory = storedHistory.filter((task) => {
    // Filter the history for only tasks deleted by the logged-in user
    const deletedByUser = task.deletedBy === loggedInUserInfo.details.username;

    // Calculate the difference in time (in milliseconds)
    const aYearAgo = new Date(
      currentDate.setFullYear(currentDate.getFullYear() - 1)
    );

    // Parse the deletedAt date of the task
    const deletedAtDate = new Date(task.deletedAt);

    // Filter out tasks that were deleted more than a year ago
    return deletedByUser && deletedAtDate > aYearAgo;
  });

  // Function to go back to the previous page
  const handleGoBack = () => {
    window.history.back(); // Go back to the previous page in the history
  };

  return (
    <>
      {/* Back Button */}
      <div className="flex justify-end mb-4 mt-28 mr-5">
        <button
          onClick={handleGoBack}
          className="p-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Back
        </button>
      </div>

      <div>
        {/* Message explaining task removal after one year */}
        <p className="text-1xl font-bold text-red-500 mt-4 text-center">
          Tasks will be automatically removed from your history after one year
          from the deletion date.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 m-5">
        {userHistory.length > 0 ? (
          userHistory.map((task) => (
            <li
              key={task._id}
              className="relative p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {task.title}
              </p>

              {task.description && <p>Description: {task.description}</p>}
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>
                <span className="font-bold">Deleted on:</span>
                {new Date(task.deletedAt).toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Empty History</h2>
            <p className="text-lg ">No tasks deleted.</p>
          </div>
        )}
      </ul>
    </>
  );
};

export default HistoryPage;
