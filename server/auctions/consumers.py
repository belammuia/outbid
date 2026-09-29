from channels.generic.websocket import AsyncJsonWebsocketConsumer


class AuctionConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            await self.close(code=4401)
            return

        self.auction_id = self.scope["url_route"]["kwargs"]["auction_id"]
        await self.accept(subprotocol=self.scope.get("accepted_subprotocol"))
        await self.send_json({"message": "hello world"})

    async def disconnect(self, code):
        pass