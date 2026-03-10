import DeleteBoardModal from "./DeleteBoardModal";
import { render, screen } from "@testing-library/react";

describe("DeleteBoardModal component", () => {
  test("warning modal will show when user tries to delete board with tasks in it", () => {
    render(
      <DeleteBoardModal
        taskCount={true}
        onCloseDeleteModal={jest.fn()}
        confirmDeleteBoard={jest.fn()}
      />,
    );

    expect(
      screen.getByText(/Board with tasks cannot be deleted/i),
    ).toBeInTheDocument();
  });

  test("shows delete/cancel when user deletes an empty board", () => {
    render(
      <DeleteBoardModal
        taskCount={false}
        onCloseDeleteModal={jest.fn()}
        confirmDeleteBoard={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
