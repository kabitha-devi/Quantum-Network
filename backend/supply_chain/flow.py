from blockchain.chain import BlockchainWrapper
from .participant import Participant
import uuid

class SupplyChainSystem:
    def __init__(self, mode='Classical'):
        self.blockchain = BlockchainWrapper()
        self.set_mode(mode)
        
    def set_mode(self, mode: str):
        self.blockchain.set_mode(mode)
        self.mode = mode
        self.crypto_manager = self.blockchain.crypto_manager
        
        # Initialize participants with new keys
        self.manufacturer = Participant("AutoCorp", "Manufacturer", self.crypto_manager, mode)
        self.distributor = Participant("FastLogistics", "Distributor", self.crypto_manager, mode)
        self.retailer = Participant("AutoSales", "Retailer", self.crypto_manager, mode)
        
        # Keep metrics for benchmark dashboard
        self.metrics = {
            "key_gen_time_ms": (self.manufacturer.key_gen_time + self.distributor.key_gen_time + self.retailer.key_gen_time) / 3,
            "pub_key_size_bytes": self.manufacturer.pub_size,
            "priv_key_size_bytes": self.manufacturer.priv_size,
            "sig_time_ms": 0,
            "verify_time_ms": 0,
            "block_time_ms": 0
        }

    def simulate_flow(self):
        # 1. Manufacturer creates an asset (Car chassis) and sends to Distributor
        asset_id = str(uuid.uuid4())
        
        tx1, sig_time1 = self.manufacturer.create_transaction(self.distributor.public_key, asset_id)
        verify_result1 = self.blockchain.add_transaction(tx1, self.manufacturer.public_key)
        
        # 2. Mine a block
        block1 = self.blockchain.mine_pending_transactions()
        
        # 3. Distributor sends to Retailer
        tx2, sig_time2 = self.distributor.create_transaction(self.retailer.public_key, asset_id)
        verify_result2 = self.blockchain.add_transaction(tx2, self.distributor.public_key)
        
        # 4. Mine another block
        block2 = self.blockchain.mine_pending_transactions()
        
        # Update metrics
        self.metrics["sig_time_ms"] = (sig_time1 + sig_time2) / 2
        self.metrics["verify_time_ms"] = (verify_result1["time_ms"] + verify_result2["time_ms"]) / 2
        self.metrics["block_time_ms"] = (block1.creation_time_ms + block2.creation_time_ms) / 2
        
        return {
            "metrics": self.metrics,
            "chain": self.blockchain.get_chain_data()
        }
