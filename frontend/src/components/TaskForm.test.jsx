import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "./TaskForm";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("axios");
const mockProps = {
  tasks: [],
  setTasks: jest.fn(),
  onOpenAddNewTaskModal: true,
  onCloseAddNewTaskModal: jest.fn(),
};

describe("TaskForm component", () => {
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

  const renderTaskForm = (props) =>
    render(
      <MemoryRouter initialEntries={["/board/board-123"]}>
        <Routes>
          <Route path="/board/:boardId" element={<TaskForm {...props} />} />
        </Routes>
      </MemoryRouter>,
    );

  test("display error when task title is missing", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    renderTaskForm(mockProps);

    await userEvent.click(
      screen.getByRole("button", { name: /add new task/i }),
    );
    expect(
      screen.getByText(/Title field must be field out./i),
    ).toBeInTheDocument();

    expect(axios.post).not.toHaveBeenCalled();
  });

  // Test that the browser restriction is in place instead
  test("date input has min set to today to prevent past date selection", () => {
    renderTaskForm(mockProps);

    const today = new Date().toISOString().split("T")[0];
    const dateInput = screen.getByLabelText(/due date/i);

    // Confirms the min attribute is set so browser blocks past dates
    expect(dateInput).toHaveAttribute("min", today);
  });

  test("updates title input when user types", async () => {
    renderTaskForm(mockProps);

    const titleInput = screen.getByRole("textbox", { name: /task title/i });

    await userEvent.type(titleInput, "Fix the bug");

    // Input value should reflect what was typed
    expect(titleInput).toHaveValue("Fix the bug");
  });

  test("updates priority select when user chnage option", async () => {
    renderTaskForm(mockProps);

    const prioritySelect = screen.getByDisplayValue("Medium");
    await userEvent.selectOptions(prioritySelect, "High");

    expect(prioritySelect).toHaveValue("High");
  });

  test("calls onCloseAddNewTaskModal when Cancel is clicked", async () => {
    renderTaskForm(mockProps);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockProps.onCloseAddNewTaskModal).toHaveBeenCalled();
  });

  test("successful add task", async () => {
    const mockTask = {
      _id: 500,
      title: "Task500",
      description: "500th task will not be due anytime soon",
      status: "Todo",
      priority: "Low",
      dueDate: "2099-12-31",
    };

    // Mock axios.post to resolve with the new task
    axios.post.mockResolvedValue({ data: mockTask });
    renderTaskForm(mockProps);

    await userEvent.type(
      screen.getByRole("textbox", { name: /task title/i }),
      "Task500",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /description/i }),
      "500th task will not be due anytime soon",
    );

    await userEvent.selectOptions(screen.getByDisplayValue("Medium"), "Low");
    await userEvent.click(
      screen.getByRole("button", { name: /add new task/i }),
    );
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:4000/api/boards/board-123/tasks",
        expect.objectContaining({ title: "Task500", priority: "Low" }),
        { headers: { Authorization: "Bearer mock-token-123" } },
      );
    });

    expect(mockProps.setTasks).toHaveBeenCalledWith([
      ...mockProps.tasks,
      mockTask,
    ]);
    expect(mockProps.onCloseAddNewTaskModal).toHaveBeenCalled();
  });

  test("displays server error message when task creation fails", async () => {
    // Mock axios.post to reject with a server error response
    axios.post.mockRejectedValue({
      response: {
        data: { message: "Server error: could not create task" },
      },
    });

    renderTaskForm(mockProps);

    await userEvent.type(
      screen.getByRole("textbox", { name: /task title/i }),
      "Fix the bug",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /add new task/i }),
    );

    // waitFor needed because the catch block runs after the async axios call rejects
    await waitFor(() =>
      expect(
        screen.getByText(/server error: could not create task/i),
      ).toBeInTheDocument(),
    );

    // Modal should stay open when there's an error
    expect(mockProps.onCloseAddNewTaskModal).not.toHaveBeenCalled();
  });

  test("displays fallback error when network fails entirely", async () => {
    // No response at all — simulates network being down
    axios.post.mockRejectedValue(new Error("Network Error"));

    renderTaskForm(mockProps);

    await userEvent.type(
      screen.getByRole("textbox", { name: /task title/i }),
      "Fix the bug",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /add new task/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(/an error occurred creating a new task/i),
      ).toBeInTheDocument(),
    );
  });
});
