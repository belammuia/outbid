from celery import shared_task
from .bidding import close_auction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .protocols import AUCTION_CLOSED


@shared_task
def close_auction_task(auction_id):
    highest_bid, auction = close_auction(auction_id)

    if auction.status == "closed":

        channel_layer = get_channel_layer()
        room_group_name = f"auction_{auction_id}"

        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                "type": "broadcast_message",
                "message": {
                    "type": AUCTION_CLOSED,
                    "status": "closed",
                    "winner": highest_bid.bidder.display_name if highest_bid else None,
                    "final_price": str(highest_bid.amount) if highest_bid else None,
                }
            }
        )

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