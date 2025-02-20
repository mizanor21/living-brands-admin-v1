import Nav from "../ui/navbar/nav";
import Sidebar from "../ui/sidebar/sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-5 p-5">
        <Nav />

        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="bg-white shadow rounded-lg p-6 min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
