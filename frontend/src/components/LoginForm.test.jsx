import LoginForm from "./LoginForm";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), //...jest.requireActual keeps all other React Router functionality working normally
  useNavigate: () => mockNavigate,
}));

describe("LoginForm component", () => {
  const renderLoginForm = () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );
  };

  test("renders email/username and password fields", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/username\/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    //simulate a server error (the 'catch' block)
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Invalid email/username or password. Please try again.",
        },
      },
    });

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/username\/email/i), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMessage = await screen.findByText(
      /Invalid email\/username or password. Please try again./i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("shows fallback error when server sends no message", async () => {
    axios.post.mockRejectedValueOnce({});
    renderLoginForm();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMessage = await screen.findByText(
      /An error occurred during login./i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("correct redirection to /signup page when signup button is clicked", () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
