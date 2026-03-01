from .classical import ClassicalCrypto
from .pqc import PQCCrypto

class CryptoManager:
    def __init__(self):
        self.classical = ClassicalCrypto()
        self.pqc = PQCCrypto()
        
    def generate_keys(self, mode: str):
        if mode == 'PQC':
            return self.pqc.generate_keys()
        elif mode == 'Classical':
            return self.classical.generate_keys()
        else:
            raise ValueError(f"Unknown mode: {mode}")
            
    def sign(self, mode: str, message: str, private_key: str):
        if mode == 'PQC':
            return self.pqc.sign(message, private_key)
        elif mode == 'Classical':
            return self.classical.sign(message, private_key)
        else:
            raise ValueError(f"Unknown mode: {mode}")

    def verify(self, mode: str, message: str, signature: str, public_key: str):
        if mode == 'PQC':
            return self.pqc.verify(message, signature, public_key)
        elif mode == 'Classical':
            return self.classical.verify(message, signature, public_key)
        else:
            raise ValueError(f"Unknown mode: {mode}")
