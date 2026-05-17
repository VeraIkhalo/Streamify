import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col lg:flex-row h-screen">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col w-full h-full">
          <Navbar />

          <main className="flex-1 overflow-y-auto w-full">{children}</main>
        </div>
      </div>

      {showSidebar && <MobileNav />}
    </div>
  );
};
export default Layout;