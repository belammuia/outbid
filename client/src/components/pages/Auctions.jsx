import { useEffect, useState } from "react";
import AuctionCard from "../auctions/AuctionCard";
import { useAuth } from "../hooks/useAuth";

export default function Auctions() {
    const { token } = useAuth();

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8001/api/v1/auctions/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch auctions");
                }

                const data = await response.json();

                setAuctions(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAuctions();
        }
    }, [token]);

    if (loading) {
        return <p>Loading auctions...</p>;
    }

    if (error) {
        return (
            <div className="text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Auctions
                </h1>

                <p className="text-gray-500 mt-2">
                    Discover items and place your bids.
                </p>
            </div>

            {/* Auctions */}
            {auctions.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        No auctions available
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Check back later for new auctions.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                        <AuctionCard
                            key={auction.id}
                            auction={auction}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}