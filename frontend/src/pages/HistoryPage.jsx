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
      currentDate.setFullYear(currentDate.getFullYear() - 1),
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-slate-800 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Delete History
          </h1>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGoBack}
              className="group inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl text-lg font-semibold text-gray-800 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>
          </div>

          {/* Message explaining task removal after one year */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl font-semibold text-gray-700 bg-white/60 backdrop-blur-sm px-8 py-6 rounded-3xl shadow-xl border border-gray-200/50 mb-12">
              Tasks will be automatically removed from your history after one
              year from the deletion date.
            </p>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {userHistory.length > 0 ? (
            userHistory.map((task) => (
              <div
                key={task._id}
                className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:bg-white"
              >
                {/* Priority Badge */}
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                  Deleted Task
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  {/* Task Details */}
                  <div className="space-y-3 pt-4 border-t border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.status === "done"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">
                        Priority
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">
                        Due Date
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold text-gray-500">
                        Deleted
                      </span>
                      <span className="text-sm font-bold text-red-600 bg-red-50/50 px-3 py-1 rounded-full">
                        {formatDate(task.deletedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-500 mb-6 drop-shadow-lg">
                Empty History
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 font-semibold max-w-md leading-relaxed">
                No tasks deleted yet. Your history will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
