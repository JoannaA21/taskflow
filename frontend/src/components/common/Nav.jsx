import { useState, useEffect } from "react";
import { useLocation, Link, Outlet, useParams } from "react-router-dom";
import Lottie from "lottie-react"; // Import Lottie
import animationData from "../../assets/lottie/Animation-taskManagement - 1731885778267.json";

const Nav = () => {
  const location = useLocation(); // Get the current location
  const loggedInUserInfo = JSON.parse(localStorage.getItem("loggedIn"));
  const user = loggedInUserInfo.details.username;
  const { boardId } = useParams();
  const [navText, setNavtext] = useState("");
  const [linkTo, setLinkTo] = useState("");

  console.log(boardId);
  // Update navText and linkTo based on the current location/path
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setNavtext("Add New Board");
      setLinkTo("/boardform"); // link to the static /boardform
    } else if (location.pathname.startsWith("/board/")) {
      setNavtext("Add New Task");
      setLinkTo(`/taskform/${boardId}`); // link to the dynamic task form route
    } else {
      setNavtext("");
      setLinkTo(""); // No link for other paths
    }
  }, [location.pathname, boardId]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4 ">
        <Link
          to="/dashboard"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Lottie animationData={animationData} loop={true} className="h-14" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Task Management
          </span>
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {navText && linkTo && (
            <Link
              to={linkTo} // Navigate to the corresponding route
              className="text-sm  dark:text-white hover:text-primary-700"
            >
              {navText}
            </Link>
          )}

          <p className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {user}
          </p>
        </div>
        <Outlet /> {/* This is where the routed content will go */}
      </div>
    </nav>
  );
};

export default Nav;
