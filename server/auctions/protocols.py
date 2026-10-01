BID = "bid"  # { "type": "bid", "amount": "150.00" }

SNAPSHOT = "snapshot"          # { "type": "snapshot", "current_price": ..., "ends_at": ..., "server_time": ..., "recent_bids": [...] }
BID_ACCEPTED = "bid_accepted"  # { "type": "bid_accepted", "amount": ..., "bidder": ..., "server_time": ... }
BID_REJECTED = "bid_rejected"  # { "type": "bid_rejected", "reason": "bid_too_low" }
AUCTION_EXTENDED = "auction_extended"  # { "type": "auction_extended", "ends_at": ..., "server_time": ... }
AUCTION_CLOSED = "auction_closed"      # { "type": "auction_closed", "winner": ..., "final_price": ... }