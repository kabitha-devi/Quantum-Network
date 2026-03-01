import time
from typing import List
from .block import Block
from .transaction import Transaction
from crypto_engine.manager import CryptoManager

class BlockchainWrapper:
    def __init__(self):
        self.chain: List[Block] = []
        self.pending_transactions: List[Transaction] = []
        self.crypto_mode = 'Classical' # 'Classical' or 'PQC'
        self.crypto_manager = CryptoManager()
        
        # Create Genesis Block
        self._create_block(previous_hash="0")

    def set_mode(self, mode: str):
        if mode not in ['Classical', 'PQC']:
            raise ValueError("Invalid Mode")
        self.crypto_mode = mode

    def add_transaction(self, tx: Transaction, public_key: str):
        # Verify transaction signature using current mode
        sign_data = tx.get_signing_data()
        
        verify_result = self.crypto_manager.verify(
            mode=self.crypto_mode, 
            message=sign_data, 
            signature=tx.signature, 
            public_key=public_key
        )
        
        if not verify_result["is_valid"]:
            raise Exception("Invalid Transaction Signature!")
            
        self.pending_transactions.append(tx)
        return verify_result

    def _create_block(self, previous_hash: str) -> Block:
        start_time = time.time()
        new_block = Block(
            index=len(self.chain),
            transactions=self.pending_transactions,
            previous_hash=previous_hash,
        )
        # We don't implement Proof of Work here since Enterprise chains often use PBFT/Raft
        # which is purely signature validation + consensus. We just do simple hashing.
        
        self.pending_transactions = []
        
        end_time = time.time()
        new_block.creation_time_ms = (end_time - start_time) * 1000
        
        self.chain.append(new_block)
        return new_block

    def mine_pending_transactions(self):
        if not self.chain:
            prev_hash = "0"
        else:
            prev_hash = self.chain[-1].hash
            
        return self._create_block(prev_hash)
        
    def get_chain_data(self):
        return [b.to_dict() for b in self.chain]
