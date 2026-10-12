import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBids() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyBids = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setError("You are not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:8001/api/v1/my-bids/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setBids(response.data);
            } catch (error) {
                console.error("Failed to fetch bids:", error);
                setError("Failed to load your bids.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBids();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading your bids...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                My Bids
            </h1>

            {bids.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-500">
                        You haven't placed any bids yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => (
                        <div
                            key={bid.id}
                            className="bg-white border border-gray-200 rounded-lg p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {bid.auction.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Your bid:{" "}
                                        <span className="font-medium text-gray-900">
                                            KSh {bid.amount}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Current price:{" "}
                                        <span className="font-medium text-gray-900">
                                            KSh {bid.auction.current_price}
                                        </span>
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        bid.auction.status === "open"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {bid.auction.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBids;

