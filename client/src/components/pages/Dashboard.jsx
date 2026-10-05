const Dashboard = () => {
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

                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">Active Auctions</p>
                    <h2 className="text-3xl font-bold mt-2">0</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">My Active Bids</p>
                    <h2 className="text-3xl font-bold mt-2">0</h2>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    <p className="text-gray-500 text-sm">My Auctions</p>
                    <h2 className="text-3xl font-bold mt-2">0</h2>
                </div>

            </section>

            {/* Featured auctions */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-900">
                        Discover Auctions
                    </h2>

                    <a
                        href="/dashboard/auctions"
                        className="text-purple-700 text-sm font-medium"
                    >
                        View all
                    </a>
                </div>

                <div className="bg-white border rounded-xl p-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Nothing to show yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Available auctions will appear here.
                    </p>
                </div>
            </section>

        </div>
    );
};

export default Dashboard;