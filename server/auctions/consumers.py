import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .bidding import place_bid, BidRejected
from channels.db import database_sync_to_async
from .models import Auction, Bid
from .protocols import BID_REJECTED, SNAPSHOT, BID_ACCEPTED,AUCTION_EXTENDED, AUCTION_CLOSED
from django.utils import timezone
from decimal import Decimal



class AuctionConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def get_auction(self, auction_id):
        return Auction.objects.get(id=auction_id)

    @database_sync_to_async
    def get_recent_bids(self, auction,limit=8):
        return list(
            Bid.objects.filter(auction=auction).
            select_related('bidder').
            order_by('-created_at')[:limit]
        )
    @database_sync_to_async
    def place_bid_sync(self, amount):
        return place_bid(auction_id=self.auction_id, user=self.scope["user"], amount=amount)
    def build_snapshot(self, auction, recent_bids):
        return {
            "type": SNAPSHOT,
            "current_price": str(auction.current_price),
            "ends_at": auction.ends_at.isoformat(),
            "server_time": timezone.now().isoformat(),
            "recent_bids": [
                {"bidder": bid.bidder.display_name, "amount": str(bid.amount)}
                for bid in recent_bids
            ],
        }

    async def connect(self):
        self.auction_id = self.scope["url_route"]["kwargs"]["auction_id"]
        self.room_group_name = f"auction_{self.auction_id}"

        user = self.scope["user"]
        if user.is_anonymous:
            await self.close(code=4401)
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept(subprotocol=self.scope.get("accepted_subprotocol"))


        auction = await self.get_auction(self.auction_id)
        recent_bids = await self.get_recent_bids(auction)

        await self.send(json.dumps(self.build_snapshot(auction, recent_bids)))


    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        unfiltered_amount = data['amount']
        amount = Decimal(str(unfiltered_amount))

        try:
            ongoing_bid, extended = await self.place_bid_sync(amount)

            if extended:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "broadcast_message",
                        "message": {
                            "type": AUCTION_EXTENDED,
                            "ends_at": ongoing_bid.ends_at.isoformat()
                        }
                    }
                )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast_message",
                    "message": {
                        "type": BID_ACCEPTED,
                        "amount": str(amount)
                    }
                }
            )

        except BidRejected as e:
            await self.send(
                json.dumps({
                    "type": BID_REJECTED,
                    "reason": e.reason
                })
            )

    async def broadcast_message(self, event):
        await self.send(json.dumps(event["message"]))


    
