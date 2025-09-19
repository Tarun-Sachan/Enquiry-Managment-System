import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Users", path: "/admin/users" },
  { label: "Enquiries", path: "/admin/enquiries" },
];

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="mb-6 bg-white shadow rounded-xl p-4 flex items-center justify-between">
      {/* Nav links */}
      <div className="flex gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Logout button on extreme right */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
      >
        Logout
      </button>
    </nav>
  );
}
