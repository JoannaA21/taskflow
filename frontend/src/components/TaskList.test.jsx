import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import TaskList from "./TaskList";

jest.mock("axios");

describe("TaskList Component", () => {
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

  const mockTasks = [
    {
      _id: "1",
      title: "Fix login bug",
      description: "Login button not responding",
      status: "in progress",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    },
    {
      _id: "2",
      title: "Write unit tests",
      description: "Cover all components",
      status: "Todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    },
  ];

  const renderTaskList = () => {
    render(<TaskList boardId="board-123" />);
  };

  test("dislays empty state when no tasks exist", async () => {
    //mock API return empty array - no tasks for this board
    axios.get.mockResolvedValue({ data: [] });
    renderTaskList();

    await waitFor(() => {
      expect(
        screen.getByText(/Click on Add New Task to get started/i),
      ).toBeInTheDocument();
    });
  });

  test("renders taks after successful fetch", async () => {
    axios.get.mockResolvedValue({ data: mockTasks });
    renderTaskList();
    await waitFor(() => {
      expect(screen.getByText(/Fix login bug/i)).toBeInTheDocument();
      expect(screen.getByText(/Write unit tests/i)).toBeInTheDocument();
    });
  });

  test("shows error message when fetch fails", async () => {
    // Simulate network failure
    axios.get.mockRejectedValue(
      new Error("Failed to load tasks. Please try again"),
    );

    renderTaskList();

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load tasks. Please try again/i),
      ).toBeInTheDocument();
    });
  });

  test("refetches tasks when boardId changes", async () => {
    axios.get.mockResolvedValue({ data: mockTasks });

    const { rerender } = render(<TaskList />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Rerender with a different boardId — useEffect should fire again
    rerender(<TaskList boardId="board-456" />);

    await waitFor(() => {
      // Should have been called a second time with the new boardId
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenLastCalledWith(
        "http://localhost:4000/api/boards/board-456/tasks",
        { headers: { Authorization: "Bearer mock-token-123" } },
      );
    });
  });
});
