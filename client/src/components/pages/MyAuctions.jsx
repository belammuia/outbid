import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const fetchMyAuctions = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setError("You are not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:8001/api/v1/auctions/my_auctions/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAuctions(response.data);
            } catch (error) {
                console.error("Failed to fetch auctions:", error);
                setError("Failed to load your auctions.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyAuctions();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading your auctions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    My Auctions
                </h1>

                <button
                    onClick={() => navigate("/dashboard/create-auction")}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
                >
                    Create Auction
                </button>
            </div>

            {auctions.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-500">
                        You haven't created any auctions yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <div
                            key={auction.id}
                            className="bg-white border border-gray-200 rounded-lg p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {auction.title}
                                </h2>

                                <span
                                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                                        auction.status === "open"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {auction.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                                {auction.description}
                            </p>

                            <div className="mt-5 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Starting price
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        KSh {auction.start_price}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Current price
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        KSh {auction.current_price}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Ends
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {new Date(
                                            auction.ends_at
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100">
                                <button
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    View Auction
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyAuctions;

