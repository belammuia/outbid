from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Auction, Bid
from .serializers import AuctionSerializer, BidSerializer
from .tasks import close_auction_task
from django.db import transaction


class IsSellerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.seller == request.user


class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsSellerOrReadOnly
    ]

    def perform_create(self, serializer):
        auction = serializer.save(
            seller=self.request.user,
            current_price=serializer.validated_data["start_price"],
        )

        transaction.on_commit(
            lambda: close_auction_task.apply_async(
                args=[auction.id],
                eta=auction.ends_at,
            )
        )

    @action(detail=False, methods=["get"])
    def my_auctions(self, request):
        auctions = Auction.objects.filter(
            seller=request.user
        )

        serializer = self.get_serializer(auctions, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def latest_auctions(self, request):
        auctions = Auction.objects.filter(
            status=Auction.Status.OPEN
        ).order_by("-created_at")[:5]

        serializer = self.get_serializer(auctions, many=True)

        return Response(serializer.data)


class MyBidsView(generics.ListAPIView):
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bid.objects.filter(
            bidder=self.request.user
        ).select_related("auction")


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        active_auction_count = Auction.objects.filter(
            status=Auction.Status.OPEN
        ).count()

        my_active_bid_count = Bid.objects.filter(
            bidder=request.user,
            auction__status=Auction.Status.OPEN
        ).count()

        my_auction_count = Auction.objects.filter(
            seller=request.user
        ).count()


        return Response({
            "active_auction_count": active_auction_count,
            "my_active_bid_count": my_active_bid_count,
            "my_auction_count": my_auction_count,
        })