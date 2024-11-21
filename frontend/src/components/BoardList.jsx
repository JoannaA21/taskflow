import React, { useState, useRef } from "react";
import TaskList from "./TaskList";
import { Link } from "react-router-dom";

const BoardList = ({ boards }) => {
  const containerRef = useRef(null); // Reference for the container
  const [scrollIndex, setScrollIndex] = useState(0); // Current scroll index

  const handleScroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = container.offsetWidth; // Width of the visible container
    if (direction === "left" && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (
      direction === "right" &&
      scrollIndex < Math.ceil(boards.length / 5) - 1
    ) {
      setScrollIndex(scrollIndex + 1);
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full px-4 md:px-12">
      {/* Left Arrow */}
      {scrollIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg"
          onClick={() => handleScroll("left")}
        >
          &lt;
        </button>
      )}

      {/* Board Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-scroll scroll-smooth no-scrollbar space-x-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {boards.map((board, index) => {
          const hue = (index * 137) % 360; // Dynamic color
          const backgroundColor = `hsl(${hue}, 70%, 80%)`;

          return (
            <Link
              to={`/board/${board._id}`}
              key={board._id}
              className="flex-shrink-0 w-1/5 max-w-sm border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:scale-105 transition duration-200 "
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Colored Top Section */}
              <div
                className="p-4 rounded-t-lg flex flex-col justify-center "
                style={{ backgroundColor, height: "120px" }}
              >
                <h3 className="text-base font-semibold text-gray-900 md:text-xl dark:text-white">
                  {board.name}
                </h3>
                <p className="mt-2 text-gray-700">{board.description}</p>
              </div>

              {/* White Task Section */}
              <div className="bg-white min-w-[150px] p-4 rounded-b-lg">
                <TaskList boardId={board._id} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right Arrow */}
      {scrollIndex < Math.ceil(boards.length / 5) - 1 && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-300 rounded-full shadow-lg"
          onClick={() => handleScroll("right")}
        >
          &gt;
        </button>
      )}
    </div>
  );
};

export default BoardList;
