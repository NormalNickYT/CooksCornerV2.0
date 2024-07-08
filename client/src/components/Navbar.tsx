import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Switcher from "./ui/switcher";
import { useAuth } from "@/context/AuthProvider";
import { CircleUserRound } from "lucide-react";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleNav = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { id: 1, text: "Home" },
    { id: 2, text: "Categories" },
  ];

  return (
    <nav className="md:px-20 sm:px-20 top-0 z-50 backdrop-blur-lg text-text bg-light-background dark:bg-dark-background  ">
      <div className="px-4 mx-auto lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <h1 className="w-full text-2xl font-bold dark:text-dark-text">
              CooksCorner
            </h1>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12 items-center font-semibold">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`p-4 m-2 text-light-text text-lg dark:text-dark-text underline-wavy-hotpink`}
              >
                {item.text === "Home" ? (
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "text-dark-accent" : ""
                    }
                  >
                    Home
                  </NavLink>
                ) : (
                  <NavLink
                    to={"/" + item.text}
                    className={({ isActive }) =>
                      isActive ? "text-dark-accent font-bold" : ""
                    }
                  >
                    {item.text}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-8 items-center font-semibold">
            {isAuthenticated ? (
              <>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="py-2 px-3 border rounded-md dark:text-dark-text transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300"
                >
                  Sign Out
                </a>
                <Link to={"/dashboard"}>
                  <CircleUserRound className="h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-3 border rounded-md dark:text-dark-text transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-dark-accent to-dark-secondary py-2 px-3 rounded-md dark:text-dark-text transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300"
                >
                  Create an account
                </Link>
              </>
            )}
            <Switcher />
          </div>
          <div
            onClick={handleNav}
            className="z-50 lg:hidden md:flex flex-col justify-end "
          >
            {mobileDrawerOpen ? (
              <AiOutlineClose color="white" size={20} />
            ) : (
              <AiOutlineMenu color="white" size={20} />
            )}
          </div>
        </div>
      </div>
      {mobileDrawerOpen && (
        <div className="fixed right-0 z-20 border-b flex flex-col dark:bg-dark-background w-full p-12 justify-center items-center lg:hidden ">
          <ul className="flex flex-col items-center gap-4 ">
            {navItems.map((item) => (
              <li key={item.id} className="py-4">
                {item.text}
              </li>
            ))}
          </ul>
          <div className="flex space-x-6">
            {isAuthenticated ? (
              <a
                onClick={handleLogout}
                className="py-2 px-3 border rounded-md dark:text-dark-text"
              >
                Sign Out
              </a>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-3 border rounded-md dark:text-dark-text"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-dark-accent to-dark-secondary dark:text-dark-text"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
