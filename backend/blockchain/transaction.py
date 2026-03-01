import hashlib
import json
import time
from typing import List, Dict

class Transaction:
    def __init__(self, sender: str, receiver: str, asset_id: str, signature: str, timestamp: float = None):
        self.sender = sender
        self.receiver = receiver
        self.asset_id = asset_id
        self.signature = signature
        self.timestamp = timestamp or time.time()
        
    def to_dict(self):
        return {
            "sender": self.sender,
            "receiver": self.receiver,
            "asset_id": self.asset_id,
            "signature": self.signature,
            "timestamp": self.timestamp
        }
        
    def get_signing_data(self):
        # We sign the core transaction details
        return f"{self.sender}:{self.receiver}:{self.asset_id}:{self.timestamp}"
