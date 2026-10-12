import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:8001/api/auth/v1/signup/",
                {
                    email,
                    password,
                }
            );

            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Unable to create account."
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
                        Join the auction marketplace
                    </p>
                </div>

                <div className="bg-white border rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Create account
                    </h2>

                    <p className="text-gray-500 mt-1 mb-6">
                        Create an account to start bidding.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
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
                                placeholder="Create a password"
                                required
                                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm your password"
                                required
                                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-purple-700 font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;