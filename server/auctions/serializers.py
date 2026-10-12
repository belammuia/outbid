from rest_framework import serializers
from .models import Auction, Bid


class AuctionSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source="seller.username")

    class Meta:
        model = Auction
        fields = [
            "id",
            "title",
            "description",
            "start_price",
            "current_price",
            "status",
            "ends_at",
            "seller",
        ]
        read_only_fields = ["id", "current_price", "status"]


class BidSerializer(serializers.ModelSerializer):
    auction = AuctionSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = [
            "id",
            "auction",
            "amount",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "auction",
            "amount",
            "created_at",
        ]

