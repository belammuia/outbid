from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AuctionViewSet, MyBidsView, DashboardView

router = DefaultRouter()

router.register("auctions", AuctionViewSet, basename="auction")

urlpatterns = router.urls

urlpatterns += [
    path("my-bids/", MyBidsView.as_view(), name="my-bids"),
    path("dashboard/", DashboardView.as_view(), name="dashboard")
]