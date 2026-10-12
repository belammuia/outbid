import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAuction() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_price: "",
        end_date: "",
        end_time: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("You are not authenticated.");
            return;
        }

        if (!formData.end_date || !formData.end_time) {
            setError("Please select both an end date and end time.");
            return;
        }

        // Combine date and time
        const endsAt = new Date(
            `${formData.end_date}T${formData.end_time}`
        );

        // Make sure the date/time is valid
        if (isNaN(endsAt.getTime())) {
            setError("Please select a valid end date and time.");
            return;
        }

        // Make sure auction ends in the future
        if (endsAt <= new Date()) {
            setError("Auction end time must be in the future.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                start_price: formData.start_price,
                ends_at: endsAt.toISOString(),
            };

            console.log("Creating auction:", payload);

            await axios.post(
                "http://localhost:8001/api/v1/auctions/",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            navigate("/dashboard/my-auctions");
        } catch (error) {
            console.error(
                "Failed to create auction:",
                error.response?.data || error
            );

            if (error.response?.data) {
                setError(
                    Object.values(error.response.data)
                        .flat()
                        .join(" ")
                );
            } else {
                setError("Failed to create auction. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Create Auction
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Create a new auction and let people place bids.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 rounded-xl p-6 space-y-6"
            >
                {/* Auction Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Auction Title
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. PlayStation 5"
                        required
                        maxLength={120}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the item you're selling..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                {/* Starting Price */}
                <div>
                    <label
                        htmlFor="start_price"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Starting Price
                    </label>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            KSh
                        </span>

                        <input
                            id="start_price"
                            name="start_price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.start_price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                            className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Auction End Date and Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auction Ends
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label
                                htmlFor="end_date"
                                className="block text-xs text-gray-500 mb-1"
                            >
                                Date
                            </label>

                            <input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label
                                htmlFor="end_time"
                                className="block text-xs text-gray-500 mb-1"
                            >
                                Time
                            </label>

                            <input
                                id="end_time"
                                name="end_time"
                                type="time"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard/my-auctions")
                        }
                        className="px-5 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-3 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Auction"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateAuction;

