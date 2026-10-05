
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

from decimal import Decimal
from datetime import timedelta

from django.test import TransactionTestCase
from django.contrib.auth import get_user_model
from django.db import close_old_connections, connection
from django.utils import timezone

from auctions.models import Auction, Bid
from auctions.bidding import place_bid, BidRejected


User = get_user_model()


class AuctionConcurrencyTest(TransactionTestCase):

    def setUp(self):
        if connection.vendor != "postgresql":
            self.fail("This concurrency test requires PostgreSQL.")

        self.seller = User.objects.create_user(
            email="seller@test.com",
            password="testpassword123"
        )

        self.users = [
            User.objects.create_user(
                email=f"bidder_{i}@test.com",
                password="testpassword123"
            )
            for i in range(100)
        ]

    def submit_bid(self, barrier, user, amount, auction_id):
        close_old_connections()

        try:
            # Make all 100 threads wait before bidding.
            barrier.wait(timeout=30)

            place_bid(
                auction_id=auction_id,
                user=user,
                amount=Decimal(amount),
            )

            return {
                "status": "accepted",
                "amount": Decimal(amount),
                "user": user.display_name,
            }

        except BidRejected as error:
            return {
                "status": "rejected",
                "reason": error.reason,
                "amount": Decimal(amount),
            }

        finally:
            close_old_connections()

    def test_100_concurrent_bids_repeated_five_times(self):

        for run in range(5):

            auction = Auction.objects.create(
                title=f"Concurrency test auction {run}",
                description="Testing concurrent bids",
                seller=self.seller,
                start_price=Decimal("900.00"),
                current_price=Decimal("900.00"),
                ends_at=timezone.now() + timedelta(minutes=10),
            )

            barrier = Barrier(100)

            with ThreadPoolExecutor(max_workers=100) as executor:

                futures = [
                    executor.submit(
                        self.submit_bid,
                        barrier,
                        user,
                        str(901 + i),
                        auction.id,
                    )
                    for i, user in enumerate(self.users)
                ]

                results = [future.result(timeout=60) for future in futures]

            accepted = [
                result for result in results
                if result["status"] == "accepted"
            ]

            rejected = [
                result for result in results
                if result["status"] == "rejected"
            ]

            # There must be no unexpected bid rejections.
            self.assertEqual(
                len(accepted) + len(rejected),
                100
            )

            # Reload the auction from the database.
            auction.refresh_from_db()

            bids = Bid.objects.filter(auction=auction)

            # Every accepted bid must have been persisted.
            self.assertEqual(bids.count(), len(accepted))

            # There must be no duplicate bid amounts.
            amounts = list(bids.values_list("amount", flat=True))

            self.assertEqual(
                len(amounts),
                len(set(amounts))
            )

            # Current price must equal the highest persisted bid.
            highest_bid = bids.order_by("-amount").first()

            self.assertIsNotNone(highest_bid)

            self.assertEqual(
                auction.current_price,
                highest_bid.amount
            )

            # Every accepted bid must be greater than the initial price.
            self.assertTrue(
                all(result["amount"] > Decimal("900") for result in accepted)
            )

            print(
                f"Run {run + 1}: "
                f"{len(accepted)} accepted, "
                f"{len(rejected)} rejected, "
                f"highest bid = {auction.current_price}"
            )