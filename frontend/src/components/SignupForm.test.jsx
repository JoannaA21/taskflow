import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "./SignupForm";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), //...jest.requireActual keeps all other React Router functionality working normally
  useNavigate: () => mockNavigate,
}));

describe("SignupForm component", () => {
  const renderSignupForm = () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields and buttons", () => {
    renderSignupForm();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("successfully redirects to login after signup", async () => {
    //mock the user check (no match)
    axios.get.mockResolvedValueOnce({ data: [] });
    //mock the signup post success
    axios.post.mockResolvedValueOnce({ status: 201, data: { success: true } });

    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "testuser@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("displays error when password does not match", async () => {
    renderSignupForm();
    axios.get.mockResolvedValueOnce({ data: [] });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "testuser@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "passsword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    //needs to be use await since component error is wrapped in async (refer to signupForm component)
    const errorMessage = await screen.findByText(
      /Passwords do not match. Please try again./i,
    );
    expect(errorMessage).toBeInTheDocument();

    expect(axios.post).not.toHaveBeenCalled();
  });

  test("display error if username already exist", async () => {
    renderSignupForm();

    axios.get.mockResolvedValueOnce({
      data: [{ username: "test123", email: "test123@test.com" }],
    });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "test123" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "testuser@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "passsword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "passsword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    const errorMessage = await screen.findByText(
      /Username already exist. Please try again./i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("display error if email already exist", async () => {
    renderSignupForm();

    axios.get.mockResolvedValueOnce({
      data: [{ username: "test123", email: "test123@test.com" }],
    });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test123@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "passsword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "passsword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    const errorMessage = await screen.findByText(
      /Email already exist. Please login./i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("correct redirection to /login page when login button is clicked", () => {
    renderSignupForm();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
