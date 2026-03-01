from blockchain.transaction import Transaction

class Participant:
    def __init__(self, name: str, role: str, crypto_manager, mode: str):
        self.name = name
        self.role = role # Manufacturer, Distributor, Retailer
        self.crypto_manager = crypto_manager
        self.mode = mode
        
        # Generate keys on init based on mode
        keys = self.crypto_manager.generate_keys(self.mode)
        self.public_key = keys["public_key"]
        self.private_key = keys["private_key"]
        self.key_gen_time = keys["time_ms"]
        self.pub_size = keys["pub_size_bytes"]
        self.priv_size = keys["priv_size_bytes"]

    def create_transaction(self, receiver_pub_key: str, asset_id: str) -> Transaction:
        tx = Transaction(
            sender=self.public_key,
            receiver=receiver_pub_key,
            asset_id=asset_id,
            signature=""
        )
        
        sign_data = tx.get_signing_data()
        
        sign_result = self.crypto_manager.sign(
            mode=self.mode,
            message=sign_data,
            private_key=self.private_key
        )
        
        tx.signature = sign_result["signature"]
        return tx, sign_result["time_ms"]
