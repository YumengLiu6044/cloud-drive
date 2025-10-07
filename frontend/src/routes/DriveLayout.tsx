import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function DriveLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 flex flex-col space-y-4">
        <h2 className="text-xl font-semibold mb-4">Drive</h2>

        <NavLink
          to="dashboard"
          className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "text-gray-700")}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="files"
          className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "text-gray-700")}
        >
          Files
        </NavLink>

        <NavLink
          to="settings"
          className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "text-gray-700")}
        >
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 px-4 rounded"
        >
          Log out
        </button>
      </aside>

      {/* Content area */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Renders subroute content */}
      </main>
    </div>
  );
}
