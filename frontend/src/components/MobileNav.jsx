import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, MenuIcon, X, UsersIcon } from "lucide-react";

const MobileNav = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Toggle Button - visible only on small screens */}
      <div className="lg:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={toggleMenu}
          className="btn btn-circle btn-primary shadow-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="size-6" />
          ) : (
            <MenuIcon className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-base-200 border-r border-base-300 flex flex-col animate-in slide-in-from-left">
            <div className="p-5 border-b border-base-300">
              <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/" ? "btn-active" : ""
                }`}
              >
                <HomeIcon className="size-5 text-base-content opacity-70" />
                <span>Home</span>
              </Link>

              <Link
                to="/friends"
                onClick={closeMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/friends" ? "btn-active" : ""
                }`}
              >
                <UsersIcon className="size-5 text-base-content opacity-70" />
                <span>Friends</span>
              </Link>

              <Link
                to="/notifications"
                onClick={closeMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/notifications" ? "btn-active" : ""
                }`}
              >
                <BellIcon className="size-5 text-base-content opacity-70" />
                <span>Notifications</span>
              </Link>
            </nav>

            {/* USER PROFILE SECTION */}
            <div className="p-4 border-t border-base-300 mt-auto">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={authUser?.profilePic}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{authUser?.fullName}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default MobileNav;
