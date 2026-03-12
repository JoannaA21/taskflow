import BoardCard from "./BoardCard";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("../assets/images/empty_dashboard.png", () => "empty_dashboard.png");

// BoardList fetches tasks internally — mock it
axios.get.mockResolvedValue({ data: [] });

const mockSetBoards = jest.fn();

jest.mock("./TaskList", () => ({ boardId }) => (
  <div data-testid={`task-list-${boardId}`} />
));

describe("BoardCard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      "loggedIn",
      JSON.stringify({ token: "mock-token-123" }),
    );
  });

  afterEach(() => localStorage.clear());

  const renderBoardCard = (boards) => {
    render(
      <MemoryRouter>
        <BoardCard boards={boards} setBoards={mockSetBoards} />
      </MemoryRouter>,
    );
  };

  test("renders empty state when no boards", () => {
    renderBoardCard([]);

    expect(screen.getByText(/Let's get started/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You don't have any boards in your catalog yet./i),
    ).toBeInTheDocument();
  });

  test("renders board cards when boards exist", async () => {
    const boards = [
      { _id: "1", name: "Board1" },
      { _id: "2", name: "Board2" },
    ];

    renderBoardCard(boards);

    // waitFor lets all async state updates (including TaskList) finish
    await waitFor(() => {
      expect(screen.getByText(/board1/i)).toBeInTheDocument();
      expect(screen.getByText(/board2/i)).toBeInTheDocument();
    });
  });
});
