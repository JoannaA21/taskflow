import DeleteTaskModal from "./DeleteTaskModal";
import { render, screen } from "@testing-library/react";

describe("DeleteTaskModal component", () => {
  test("confirmation for task deletion", () => {
    render(
      <DeleteTaskModal
        onCloseDeleteModal={jest.fn()}
        confirmDeleteTask={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
