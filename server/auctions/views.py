from rest_framework import viewsets, permissions
from .models import Auction
from .serializers import AuctionSerializer


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
        serializer.save(
            seller=self.request.user,
            current_price=serializer.validated_data["start_price"],
        )