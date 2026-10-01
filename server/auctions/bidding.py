from .tasks import close_auction_task
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .models import Auction, Bid

ANTI_SNIPE_WINDOW = timedelta(seconds=30)
ANTI_SNIPE_EXTENSION = timedelta(seconds=30)


class BidRejected(Exception):
    """Raised with a short machine-readable reason the consumer can relay to the client."""
    def __init__(self, reason):
        self.reason = reason
        super().__init__(reason)


def place_bid(auction_id, user, amount):
    with transaction.atomic():
        auction = Auction.objects.select_for_update().get(id=auction_id)

        old_ends_at = auction.ends_at

        now = timezone.now()

        if auction.status != "open" or auction.ends_at <= now:
            raise BidRejected("auction_closed")

        if auction.seller_id == user.id:
            raise BidRejected("cannot_bid_on_own_auction")

        if amount <= auction.current_price:
            raise BidRejected("bid_too_low")

        if now > auction.ends_at - ANTI_SNIPE_WINDOW:
            auction.ends_at = now + ANTI_SNIPE_EXTENSION

        extended = auction.ends_at > old_ends_at

        Bid.objects.create(
            auction=auction,
            bidder=user,
            amount=amount
        )

        auction.current_price = amount
        auction.save()

        if extended:
            transaction.on_commit(
                lambda: close_auction_task.apply_async(
                args=[auction.id],
                eta=auction.ends_at,
                ))

    return auction, extended

def close_auction(auction_id):
    with transaction.atomic():
        auction = Auction.objects.select_for_update().get(id=auction_id)

        if auction.status == 'open' and auction.ends_at <= timezone.now():
            highest_bid = auction.bids.first()

            auction.status = 'closed'
            auction.save()

            return highest_bid, auction

        return None, auction