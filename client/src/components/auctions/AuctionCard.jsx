import { useNavigate } from "react-router-dom";

export default function AuctionCard({ auction }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">

            {/* Image placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">
                    No image
                </span>
            </div>

            {/* Content */}
            <div className="p-5">

                <h2 className="text-lg font-semibold text-gray-900">
                    {auction.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {auction.description}
                </p>

                <div className="mt-4">
                    <p className="text-xs text-gray-500">
                        Current bid
                    </p>

                    <p className="text-xl font-bold text-purple-700">
                        KSh {auction.current_price}
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-center">

                    <span className="text-sm text-gray-500">
                        {auction.status}
                    </span>

                    <button
                        onClick={() =>
                            navigate(`/dashboard/auctions/${auction.id}`)
                        }
                        className="px-4 py-2 bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-800 transition"
                    >
                        View Auction
                    </button>

                </div>

            </div>
        </div>
    );
}