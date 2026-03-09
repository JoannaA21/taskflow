import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "./Nav";
import { MemoryRouter } from "react-router-dom";

//jest.mock replaces useNavigate with our fake mockNavigate function.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), //...jest.requireActual keeps all other React Router functionality working normally
  useNavigate: () => mockNavigate,
}));

//Mock lottie animation
jest.mock("lottie-react", () => () => <div data-testid="lottie-animation" />);

describe("Nav component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  test("renders TaskFlow text", () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );

    const taskFlowtext = screen.getByText("TaskFlow");

    expect(taskFlowtext).toBeInTheDocument();
  });

  test("calls localStorage.removeItem and navigate to logout", () => {
    localStorage.setItem("loggedIn", true);
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );

    //watches localStorage.removeItem
    //const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    const logoutBtn = screen.getByText(/Logout/i); //finds the logout button - case insensitive

    fireEvent.click(logoutBtn); //simulates a user click

    //expect(removeItemSpy).toHaveBeenCalledWith("loggedIn");
    expect(localStorage.getItem("loggedIn")).toBe(null);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("clicking Lottie or TaskFlow text navigates to /dashboard", async () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>,
    );

    // TaskFlow text
    await userEvent.click(screen.getByText(/TaskFlow/i));
    const taskFlowLink = screen.getByText(/TaskFlow/i).closest("a");
    expect(taskFlowLink).toHaveAttribute("href", "/dashboard");

    // Lottie animation
    const lottieDiv = screen.getByTestId("lottie-animation"); // Lottie renders a canvas
    const lottieLink = lottieDiv.closest("a");
    expect(lottieLink).toHaveAttribute("href", "/dashboard");
  });
});
