import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [latestAuctions, setLatestAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [dashboardResponse, auctionsResponse] =
                    await Promise.all([
                        axios.get(
                            "http://localhost:8001/api/v1/dashboard/",
                            { headers }
                        ),

                        axios.get(
                            "http://localhost:8001/api/v1/auctions/latest_auctions/",
                            { headers }
                        ),
                    ]);

                setDashboard(dashboardResponse.data);
                setLatestAuctions(auctionsResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 text-center">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Welcome */}
            <section>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back!
                </h1>

                <p className="text-gray-500 mt-2">
                    Discover auctions, place bids and find something worth winning.
                </p>
            </section>


            {/* Overview cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Active Auctions */}
                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">
                        Active Auctions
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.active_auction_count}
                    </h2>
                </div>


                {/* My Active Bids */}
                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">
                        My Active Bids
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.my_active_bid_count}
                    </h2>
                </div>


                {/* My Auctions */}
                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">
                        My Auctions
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {dashboard.my_auction_count}
                    </h2>
                </div>

            </section>


            {/* Discover Auctions */}
            <section>

                {/* Section header */}
                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-bold text-gray-900">
                        Discover Auctions
                    </h2>

                    <a
                        href="/dashboard/auctions"
                        className="text-purple-700 text-sm font-medium hover:text-purple-800"
                    >
                        View all
                    </a>

                </div>


                {/* No auctions */}
                {latestAuctions.length === 0 ? (

                    <div className="bg-white border rounded-xl p-10 text-center">

                        <h3 className="text-lg font-semibold text-gray-800">
                            Nothing to show yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Available auctions will appear here.
                        </p>

                    </div>

                ) : (

                    /* Auction cards */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {latestAuctions.map((auction) => (

                            <div
                                key={auction.id}
                                className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
                            >

                                {/* Title + status */}
                                <div className="flex justify-between items-start gap-4">

                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {auction.title}
                                    </h3>

                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                                        {auction.status}
                                    </span>

                                </div>


                                {/* Description */}
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                    {auction.description ||
                                        "No description provided."}
                                </p>


                                {/* Current price */}
                                <div className="mt-5">

                                    <p className="text-sm text-gray-500">
                                        Current price
                                    </p>

                                    <p className="text-xl font-bold text-gray-900">
                                        KSh{" "}
                                        {Number(
                                            auction.current_price
                                        ).toLocaleString()}
                                    </p>

                                </div>


                                {/* Ends at */}
                                <div className="mt-3">

                                    <p className="text-sm text-gray-500">
                                        Ends
                                    </p>

                                    <p className="text-sm font-medium text-gray-800">
                                        {new Date(
                                            auction.ends_at
                                        ).toLocaleString()}
                                    </p>

                                </div>


                                {/* View auction */}
                                <a
                                    href={`/dashboard/auctions/${auction.id}`}
                                    className="block text-center mt-5 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
                                >
                                    View Auction
                                </a>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
};

export default Dashboard;

