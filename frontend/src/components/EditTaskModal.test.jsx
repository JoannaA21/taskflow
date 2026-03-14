import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import EditTaskModal from "./EditTaskModal";

jest.mock("axios");

describe("EditTaskModal component", () => {
  const mockTask = {
    _id: "task-1",
    title: "Fix login bug",
    description: "Login button not responding",
    status: "Todo",
    priority: "Medium",
    dueDate: "2099-12-31",
  };

  let mockProps;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(
      "loggedIn",
      JSON.stringify({ token: "mock-token-123" }),
    );

    //axios.get fethces the task on mount - mock it to return mockTask
    axios.get.mockResolvedValue({ data: mockTask });

    mockProps = {
      taskId: "task-1",
      onEditModal: true,
      onCloseEditModal: jest.fn(),
      onUpdateTask: jest.fn(),
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderEditTaskModal = (props = mockProps) => {
    render(<EditTaskModal {...props} />);
  };

  test("displays all fields and buttons when modal is open", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByText(/task title/i)).toBeInTheDocument();
      expect(screen.getByText(/description/i)).toBeInTheDocument();
      expect(screen.getByText(/status/i)).toBeInTheDocument();
      expect(screen.getByText(/priority/i)).toBeInTheDocument();
      expect(screen.getByText(/due date/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });
  });

  test("fetches task on mount with correct taskId and token", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:4000/api/tasks/task-1",
        {
          headers: { Authorization: "Bearer mock-token-123" },
        },
      );
    });
  });

  test("pre-fills fields with fetched task data", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fix login bug")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Login button not responding"),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue("Todo")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    });
  });

  test("updates title input when user input", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fix login bug")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Fix login bug");

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Update title");

    expect(titleInput).toHaveValue("Update title");
  });

  test("updates status select when user changes option", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Todo")).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByDisplayValue("Todo"), "Done");
    expect(screen.getByDisplayValue("Done")).toBeInTheDocument();
  });

  test("updates priority select when user changes option", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByDisplayValue("Medium"), "High");
    expect(screen.getByDisplayValue("High")).toBeInTheDocument();
  });

  test("call onCloseEditModal when user clicks on cancel", async () => {
    renderEditTaskModal();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockProps.onCloseEditModal).toHaveBeenCalled();
  });

  test("successful edit calls axios.patch, onUpdateTask, and onCloseEditModal", async () => {
    const updatedTask = {
      ...mockTask,
      taskTitle: "Updated title",
      priority: "High",
    };

    //mock patch to return the updated task
    axios.patch.mockResolvedValue({ data: updatedTask });

    renderEditTaskModal();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Fix login bug")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Fix login bug");

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated title");

    await userEvent.selectOptions(screen.getByDisplayValue("Medium"), "High");

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        "http://localhost:4000/api/tasks/task-1",
        expect.objectContaining({
          title: "Updated title",
          priority: "High",
        }),
        { headers: { Authorization: "Bearer mock-token-123" } },
      );
    });

    expect(mockProps.onUpdateTask).toHaveBeenCalledWith(updatedTask);
    expect(mockProps.onCloseEditModal).toHaveBeenCalled();
  });

  test("shows error when saving task fails", async () => {
    // axios.get succeeds (task loads), axios.patch fails (save fails)
    axios.patch.mockRejectedValue({
      response: {
        data: { message: "Failed to update task. Please try again." },
      },
    });

    renderEditTaskModal();

    // Wait for task to load
    await waitFor(() =>
      expect(screen.getByDisplayValue("Fix login bug")).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(/failed to update task\. please try again/i),
      ).toBeInTheDocument(),
    );

    expect(mockProps.onCloseEditModal).not.toHaveBeenCalled();
    expect(mockProps.onUpdateTask).not.toHaveBeenCalled();
  });
});
