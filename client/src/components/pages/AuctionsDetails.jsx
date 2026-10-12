import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuctionTimer from "../timer/AuctionTimer";

export default function AuctionsDetails() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [socket, setSocket] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [bidError, setBidError] = useState(null);

    // Fetch auction
    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8001/api/v1/auctions/${id}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch auction");
                }

                const data = await response.json();

                setAuction(data);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAuction();
        }
    }, [id, token]);


    // WebSocket
    useEffect(() => {
        if (!token || !id) {
            return;
        }

        const ws = new WebSocket(
            `ws://localhost:8001/ws/auction/${id}/`,
            [token]
        );

        ws.onopen = () => {
            console.log("WebSocket connected");
            setSocketConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log("WebSocket message:", data);

            switch (data.type) {

                case "snapshot":
                    setAuction((prev) => ({
                        ...prev,
                        current_price: data.current_price,
                        ends_at: data.ends_at,
                    }));

                    setBids(data.recent_bids || []);
                    break;


                case "bid_accepted":
                    setAuction((prev) => ({
                        ...prev,
                        current_price: data.current_price,
                    }));

                    if (data.bid) {
                        setBids((prev) => [
                            data.bid,
                            ...prev,
                        ]);
                    }

                    setBidAmount("");
                    setBidError(null);
                    break;


                case "bid_rejected":
                    setBidError(data.reason);
                    break;


                case "auction_extended":
                    setAuction((prev) => ({
                        ...prev,
                        ends_at: data.ends_at,
                    }));
                    break;


                case "auction_closed":
                    setAuction((prev) => ({
                        ...prev,
                        status: "CLOSED",
                    }));
                    break;


                default:
                    console.log(
                        "Unknown WebSocket event:",
                        data
                    );
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setSocketConnected(false);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [id, token]);


    const placeBid = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setBidError("WebSocket is not connected.");
            return;
        }

        if (!bidAmount) {
            setBidError("Enter a bid amount.");
            return;
        }

        socket.send(
            JSON.stringify({
                type: "place_bid",
                amount: bidAmount,
            })
        );
    };


    // Loading
    if (loading) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">
                    Loading auction...
                </p>
            </div>
        );
    }


    // Error
    if (error) {
        return (
            <div className="py-10">
                <p className="text-red-600">
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/dashboard/auctions")
                    }
                    className="mt-4 text-purple-700"
                >
                    ← Back to auctions
                </button>
            </div>
        );
    }


    // Auction not found
    if (!auction) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">
                    Auction not found.
                </p>
            </div>
        );
    }


    return (
        <div>

            {/* Back button */}
            <button
                onClick={() =>
                    navigate("/dashboard/auctions")
                }
                className="text-sm text-gray-500 hover:text-purple-700 mb-6"
            >
                ← Back to auctions
            </button>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Auction image */}
                <div className="h-[450px] bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-gray-400">
                        No image
                    </span>
                </div>


                {/* Auction information */}
                <div>

                    {/* Status + live connection */}
                    <div className="flex items-center justify-between">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                auction.status.toLowerCase() === "open"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {auction.status}
                        </span>

                    </div>


                    {/* WebSocket status */}
                    <div className="flex items-center gap-2 mt-2">

                        <span
                            className={`w-2 h-2 rounded-full ${
                                socketConnected
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }`}
                        />

                        <span className="text-sm text-gray-500">
                            {socketConnected
                                ? "Live"
                                : "Connecting..."}
                        </span>

                    </div>


                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        {auction.title}
                    </h1>


                    {/* Description */}
                    <p className="text-gray-500 mt-4 leading-relaxed">
                        {auction.description}
                    </p>


                    {/* Price */}
                    <div className="mt-8">

                        <p className="text-sm text-gray-500">
                            Current bid
                        </p>

                        <p className="text-4xl font-bold text-purple-700 mt-1">
                            KSh{" "}
                            {Number(
                                auction.current_price
                            ).toLocaleString()}
                        </p>

                    </div>


                    {/* Auction timer */}
                    <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                            Time remaining
                        </p>

                        <div className="text-2xl font-bold text-purple-700 mt-1">
                            <AuctionTimer
                                endsAt={auction.ends_at}
                            />
                        </div>

                    </div>


                    {/* Seller */}
                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Seller
                        </p>

                        <p className="font-medium text-gray-900 mt-1">
                            {auction.seller}
                        </p>

                    </div>


                    {/* End time */}
                    <div className="mt-6">

                        <p className="text-sm text-gray-500">
                            Ends at
                        </p>

                        <p className="font-medium text-gray-900 mt-1">
                            {new Date(
                                auction.ends_at
                            ).toLocaleString()}
                        </p>

                    </div>


                    {/* Bid section */}
                    {auction.status.toLowerCase() === "open" && (
                        <div className="mt-8">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your bid
                            </label>

                            <div className="flex gap-3">

                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={bidAmount}
                                    onChange={(e) =>
                                        setBidAmount(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />

                                <button
                                    onClick={placeBid}
                                    disabled={!socketConnected}
                                    className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition disabled:opacity-50"
                                >
                                    Place Bid
                                </button>

                            </div>


                            {/* Bid error */}
                            {bidError && (
                                <p className="text-red-600 text-sm mt-2">
                                    {bidError}
                                </p>
                            )}

                        </div>
                    )}

                </div>

            </div>


            {/* Bid history */}
            <section className="mt-12">

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Bid History
                </h2>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                    {bids.length === 0 ? (

                        <p className="p-6 text-gray-500 text-center">
                            No bids yet
                        </p>

                    ) : (

                        <div className="divide-y divide-gray-100">

                            {bids.map((bid) => (

                                <div
                                    key={bid.id}
                                    className="flex items-center justify-between px-6 py-4"
                                >

                                    <div>

                                        <p className="font-medium text-gray-900">
                                            {bid.bidder}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                bid.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <p className="font-semibold text-purple-700">
                                        KSh {bid.amount}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </section>

        </div>
    );
}