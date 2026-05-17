import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full gap-2">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
              <ShipWheelIcon className="size-6 sm:size-8 text-primary" />
              <span className="hidden sm:inline text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Streamify
              </span>
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Avatar and Logout */}
          <div className="flex items-center gap-2">
            <div className="avatar hidden sm:block">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
              </div>
            </div>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md" onClick={logoutMutation}>
              <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;