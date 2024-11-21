const DeleteTaskModal = ({ onCloseDeleteModal, confirmDeleteTask }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 md:w-[28rem] p-8 rounded-lg shadow-lg text-center">
        <p className="mb-6 text-lg font-medium">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-center space-x-6">
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold"
            onClick={confirmDeleteTask}
          >
            Delete
          </button>
          <button
            className="px-6 py-3 bg-gray-300 rounded-lg font-semibold"
            onClick={onCloseDeleteModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
