import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
    const { setTokens } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8001/api/auth/v1/login/",
                {
                    email,
                    password,
                }
            );

            setTokens(response.data.access);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">
                        Outbid
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back
                    </p>
                </div>

                <div className="bg-white border rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Sign in
                    </h2>

                    <p className="text-gray-500 mt-1 mb-6">
                        Sign in to continue to your account.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-purple-700 font-medium hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;