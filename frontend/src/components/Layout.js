import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/zarvika_logo.png";
import {
  HomeIcon,
  UserIcon,
  CubeIcon,
  ChartBarIcon,
  DocumentIcon,
  UsersIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

function Sidebar({ user }) {
  // Default menus for Super Admin
  const adminMenu = [
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "Jewellers", icon: UserIcon, path: "/jewellers" },
    { name: "Subscriptions", icon: CubeIcon, path: "/subscriptions" },
    { name: "Add-ons", icon: DocumentIcon, path: "/addons" },
    { name: "Analytics", icon: ChartBarIcon, path: "/analytics" },
    { name: "Activity Logs", icon: DocumentIcon, path: "/activity" },
    { name: "Settings", icon: CogIcon, path: "/settingsss" },
  ];

  // Menu for Jewellers (role_id = 2)
  const jewellerMenu = [
    { name: "Dashboard", icon: HomeIcon, path: "/jewellers/dashboard" },
    { name: "Staff", icon: UsersIcon, path: "/jewellers/Staff" },
    { name: "Customers", icon: UserIcon, path: "/jewellers/customers" },
    { name: "Kitty", icon: CubeIcon, path: "/jewellers/kittyList" },
    { name: "Customers Kitty", icon: CubeIcon, path: "/jewellers/CustomerKitties" },
    { name: "Settings", icon: CogIcon, path: "/jewellers/settings" },
  ];

  const staffMenu = [
    { name: "Dashboard", icon: HomeIcon, path: "/jewellers/dashboard" },
    { name: "Customers", icon: UserIcon, path: "/jewellers/customers" },
    { name: "Kitty", icon: CubeIcon, path: "/jewellers/kittyList" },
  ];

  // Choose menu based on role
  const menuItems = user
    ? user.role_id === 1
      ? adminMenu
      : user.role_id === 2
        ? jewellerMenu
        : user.role_id === 4
          ? staffMenu
          : []
    : [];
  return (
    <aside className="w-64 bg-gradient-to-b from-purple-700 via-purple-600 to-purple-500 text-white flex flex-col p-6 min-h-screen shadow-lg">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Link to={user?.role_id === 2 ? "/jewellers/dashboard" : "/dashboard"}>
          <img src={logo} alt="Zarvika Logo" className="h-16 w-auto" />
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center px-4 py-2 rounded-lg hover:bg-purple-400 hover:bg-opacity-30 transition duration-300"
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function Layout({ children, user: propUser, setUser }) {
  const navigate = useNavigate();

  // Get user from props or localStorage
  const user = propUser || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // redirect immediately if no user
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : "User"}!
          </h1>

          <div>
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
