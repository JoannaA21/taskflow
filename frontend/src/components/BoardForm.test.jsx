import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import BoardForm from "./BoardForm";

jest.mock("axios");

describe("BoardForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.setItem(
      "loggedIn",
      JSON.stringify({ token: "mock-token-123" }),
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  const mockProps = {
    onOpenAddNewBoardModal: true,
    onCloseAddNewBoardModal: jest.fn(),
    onBoardAdded: jest.fn(),
  };

  const renderBoardForm = () => {
    render(<BoardForm {...mockProps} />);
  };

  test("displays fields and buttons", () => {
    renderBoardForm();

    expect(screen.getByLabelText(/board name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new board/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("shows validation error when board name is empty on submit", async () => {
    renderBoardForm();

    await userEvent.click(
      screen.getByRole("button", { name: /add new board/i }),
    );
    expect(
      screen.getByText(/Name field must be field out/i),
    ).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("successful add board", async () => {
    axios.post.mockResolvedValue({
      data: { id: 1, name: "New Board", description: "New added board" },
    });

    renderBoardForm();

    await userEvent.type(screen.getByLabelText(/board name/i), "New Board");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "New added board",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /add new board/i }),
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/api/boards/",
        { name: "New Board", description: "New added board" },
        { headers: { Authorization: `Bearer mock-token-123` } },
      );
      expect(mockProps.onBoardAdded).toHaveBeenCalled();
      expect(mockProps.onCloseAddNewBoardModal).toHaveBeenCalled();
    });
  });

  test("displays validation error (catch block) when board creation fails", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Server error: could not create board",
        },
      },
    });

    renderBoardForm();

    await userEvent.type(screen.getByLabelText(/board name/i), "New Board");
    await userEvent.click(
      screen.getByRole("button", { name: /add new board/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/server error: could not create board/i),
      ).toBeInTheDocument();
    });

    // modal should stay open on error
    expect(mockProps.onCloseAddNewBoardModal).not.toHaveBeenCalled();
    expect(mockProps.onBoardAdded).not.toHaveBeenCalled();
  });
});
