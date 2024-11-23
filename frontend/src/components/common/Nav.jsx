import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../../assets/lottie/Animation-taskManagement - 1731885778267.json";

const Nav = () => {
  const navigate = useNavigate();

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsScrollingDown(true); // Scroll down
      } else {
        setIsScrollingDown(false); // Scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`bg-primary-700 dark:bg-gray-900 fixed w-full top-0 z-10 start-0 border-b border-gray-200 dark:border-gray-600 transition-transform duration-300 ${
          isScrollingDown ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Lottie
              animationData={animationData}
              loop={true}
              className="h-14"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-white">
              Task Management
            </span>
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p
              className="text-primary-200 text-2xl font-bold cursor-pointer hover:text-white"
              onClick={logout}
            >
              Logout
            </p>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Nav;
