import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { use } from "react";

export default function Navbar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const links = [
        { name: "Home", path: "/dashboard", end: true },
        { name: "Auctions", path: "/dashboard/auctions" },
        { name: "My Bids", path: "/dashboard/my-bids" },
        { name: "My Auctions", path: "/dashboard/my-auctions" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <NavLink
                    to="/dashboard"
                    className="text-2xl font-bold text-purple-700"
                >
                    Outbid<span className="text-gray-900">.</span>
                </NavLink>

                {/* Navigation */}
                <div className="flex items-center gap-8">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-purple-700"
                                        : "text-gray-500 hover:text-purple-700"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Account */}
                <div className="flex items-center gap-4">

                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                        <p>{user?.display_name ? user.display_name.charAt(0).toUpperCase() : '...'}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}