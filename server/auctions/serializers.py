from rest_framework import serializers
from .models import Auction

class AuctionSerializer(serializers.ModelSerializer):
    seller = serializers.ReadOnlyField(source="seller.username")

    class Meta:
        model = Auction
        fields = [
            "id", "title", "description", "start_price",
            "current_price", "status", "seller",
        ]
        read_only_fields = ["id","current_price", "status"]