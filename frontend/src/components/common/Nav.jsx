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
        className={`backdrop-blur-xl bg-primary-700/95 dark:bg-gray-900/95 fixed w-full top-0 z-10 start-0 border-b border-white/20 dark:border-gray-600/50 shadow-xl transition-all duration-500 ${
          isScrollingDown ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex justify-between items-center mx-auto max-w-screen-xl px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300"
          >
            <div className="relative overflow-hidden rounded-2xl p-2 bg-white/20 shadow-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
              <Lottie
                animationData={animationData}
                loop={true}
                className="h-14 w-14 drop-shadow-lg"
              />
            </div>
            <span className="self-center bg-gradient-to-r from-white/90 to-white text-lg sm:text-3xl font-black whitespace-nowrap drop-shadow-2xl bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <p
              className="group relative bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl font-bold text-lg sm:text-xl text-white/95 cursor-pointer hover:bg-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-white/30 hover:border-white/50 shadow-xl"
              onClick={logout}
            >
              <span className="relative z-10">Logout</span>
            </p>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Nav;
