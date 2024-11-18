import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const Nav = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    setIsUserLoggedIn(location.pathname === "/dashboard");
  }, [location.pathname]);

  return <div></div>;
};

export default Nav;
