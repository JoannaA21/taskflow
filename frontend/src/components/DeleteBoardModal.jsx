const DeleteBoardModal = ({
  taskCount,
  onCloseDeleteModal,
  confirmDeleteBoard,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
      {taskCount && (
        <div className="bg-red-600 w-96 md:w-[28rem] p-8 rounded-lg shadow-lg text-center">
          <>
            <p className="mb-6 text-2xl font-medium text-white">
              Board with tasks cannot be deleted. Remove all tasks first before
              you can take the action of delete a board.
            </p>
            <button
              className="px-6 py-3 bg-gray-300 hover:bg-white rounded-lg font-semibold"
              onClick={onCloseDeleteModal}
            >
              OK
            </button>
          </>
        </div>
      )}

      {!taskCount && (
        <div className="bg-white w-96 md:w-[28rem] p-8 rounded-lg shadow-lg text-center">
          <>
            <p className="mb-6 text-lg font-medium">
              Are you sure you want to delete this board?
            </p>
            <div className="flex justify-center space-x-6">
              <button
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold"
                onClick={confirmDeleteBoard}
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
          </>
        </div>
      )}
    </div>
  );
};

export default DeleteBoardModal;
