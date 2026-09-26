import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide text-amber-400">
        🍹 Requ Cocktail
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-amber-400 transition">
          Main
        </Link>

        {user ? (
          <>
            <Link
              to="/my-cocktails"
              className="hover:text-amber-400 transition"
            >
              My Cocktails
            </Link>
            <Link
              to="/add-cocktail"
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-4 py-2 rounded-lg transition"
            >
              + Create new Cocktail
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Admin panel
              </Link>
            )}

            <div className="flex items-center gap-3 border-l pl-4 border-gray-700">
              <img
                src={
                  user.avatar.startsWith("http")
                    ? user.avatar
                    : `http://localhost:3000${user.avatar}`
                }
                alt={user.displayName}
                className="w-9 h-9 rounded-full object-cover border border-amber-400"
              />
              <span className="font-medium">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition ml-2"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-4 py-2 rounded-lg transition"
            >
              Registration
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
