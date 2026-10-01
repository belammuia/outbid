from rest_framework import viewsets, permissions
from .models import Auction
from .serializers import AuctionSerializer
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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]

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