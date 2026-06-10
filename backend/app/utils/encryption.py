import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

_key = os.getenv("AES_SECRET_KEY")
_fernet = Fernet(_key) if _key else None

def encrypt_data(data: str) -> str:
    """Encrypts a string using AES (Fernet)."""
    if not _fernet or not data:
        return data
    return _fernet.encrypt(data.encode('utf-8')).decode('utf-8')

def decrypt_data(encrypted_data: str) -> str:
    """Decrypts a string using AES (Fernet)."""
    if not _fernet or not encrypted_data:
        return encrypted_data
    try:
        return _fernet.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
    except Exception:
        # If decryption fails (e.g. data was not encrypted), return as is
        return encrypted_data
