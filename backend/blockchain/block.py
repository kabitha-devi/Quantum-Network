import hashlib
import json
import time
from typing import List
from .transaction import Transaction

class Block:
    def __init__(self, index: int, transactions: List[Transaction], previous_hash: str, timestamp: float = None, creation_time_ms: float = 0):
        self.index = index
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.timestamp = timestamp or time.time()
        self.creation_time_ms = creation_time_ms # Store how long it took to create (for benchmarking)
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        tx_data = json.dumps([tx.to_dict() for tx in self.transactions], sort_keys=True)
        block_string = f"{self.index}{tx_data}{self.previous_hash}{self.timestamp}"
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()
        
    def to_dict(self):
        return {
            "index": self.index,
            "transactions": [tx.to_dict() for tx in self.transactions],
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "timestamp": self.timestamp,
            "creation_time_ms": self.creation_time_ms
        }
