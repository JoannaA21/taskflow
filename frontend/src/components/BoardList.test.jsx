import BoardList from "./BoardList";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("BoardList component", () => {
  test("render boards name", () => {
    localStorage.setItem(
      "loggedIn",
      JSON.stringify({ token: "fake-jwt-token" }),
    );

    const fakeBoard = [
      { name: "Code", description: "Refactor", _id: "123" },
      { name: "Work", description: "Daily tasks", _id: "456" },
    ];
    render(
      <MemoryRouter>
        <BoardList boards={fakeBoard} setBoards={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  test("board links to correct url for redirection when board is clicked", () => {
    localStorage.setItem(
      "loggedIn",
      JSON.stringify({ token: "fake-jwt-token" }),
    );

    const fakeBoard = [
      { name: "Code", description: "Refactor", _id: "123" },
      { name: "Work", description: "Daily tasks", _id: "456" },
    ];
    render(
      <MemoryRouter>
        <BoardList boards={fakeBoard} setBoards={() => {}} />
      </MemoryRouter>,
    );

    const boardLink = screen.getByText("Code").closest("a");
    expect(boardLink).toHaveAttribute("href", "/board/123");
  });
});
