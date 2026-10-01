from celery import shared_task
from .bidding import close_auction


@shared_task
def close_auction_task(auction_id):
    highest_bid, auction = close_auction(auction_id)

    if auction.status == "closed":
        return {
            "auction_id": auction_id,
            "status": "closed",
            "winner": highest_bid.bidder.display_name if highest_bid else None,
            "final_price": str(highest_bid.amount) if highest_bid else None,
        }

    return {
        "auction_id": auction_id,
        "status": "not_closed",
    }