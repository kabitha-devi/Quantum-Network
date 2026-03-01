import rsa
import time
import base64

class ClassicalCrypto:
    def __init__(self, key_size=2048):
        self.key_size = key_size
        self.public_key = None
        self.private_key = None

    def generate_keys(self):
        start_time = time.time()
        self.public_key, self.private_key = rsa.newkeys(self.key_size)
        end_time = time.time()
        
        # Serialize keys for storage/display
        pub_pem = self.public_key.save_pkcs1().decode('utf-8')
        priv_pem = self.private_key.save_pkcs1().decode('utf-8')
        
        return {
            "public_key": pub_pem,
            "private_key": priv_pem,
            "time_ms": (end_time - start_time) * 1000,
            "pub_size_bytes": len(pub_pem),
            "priv_size_bytes": len(priv_pem)
        }

    def sign(self, message: str, private_key_pem: str):
        priv_key = rsa.PrivateKey.load_pkcs1(private_key_pem.encode('utf-8'))
        message_bytes = message.encode('utf-8')
        
        start_time = time.time()
        signature = rsa.sign(message_bytes, priv_key, 'SHA-256')
        end_time = time.time()
        
        sig_b64 = base64.b64encode(signature).decode('utf-8')
        return {
            "signature": sig_b64,
            "time_ms": (end_time - start_time) * 1000,
            "sig_size_bytes": len(signature)
        }

    def verify(self, message: str, signature_b64: str, public_key_pem: str):
        pub_key = rsa.PublicKey.load_pkcs1(public_key_pem.encode('utf-8'))
        message_bytes = message.encode('utf-8')
        signature = base64.b64decode(signature_b64)
        
        start_time = time.time()
        try:
            rsa.verify(message_bytes, signature, pub_key)
            is_valid = True
        except rsa.VerificationError:
            is_valid = False
        end_time = time.time()
        
        return {
            "is_valid": is_valid,
            "time_ms": (end_time - start_time) * 1000
        }
