import { useEffect, useState } from "react";

function AuctionTimer({ endsAt }) {
    const calculateTimeLeft = () => {
        const difference = new Date(endsAt) - new Date();

        if (difference <= 0) {
            return null;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );
        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );
        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        return {
            days,
            hours,
            minutes,
            seconds,
        };
    };

    const [timeLeft, setTimeLeft] = useState(
        calculateTimeLeft()
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endsAt]);

    if (!timeLeft) {
        return (
            <span className="text-red-600 font-medium">
                Auction ended
            </span>
        );
    }

    return (
        <span className="font-medium text-gray-800">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
        </span>
    );
}

export default AuctionTimer;