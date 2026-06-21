import os
import uuid
import jwt
import hashlib
import hmac
from datetime import datetime
from src.database.dynamodb import DynamoDBClient
from src.events.auth_events import publish_user_registered

def hash_password(password: str) -> str:
    salt = os.urandom(32).hex()
    hashed = hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split(":")
    return hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest() == hashed

def register_user(email, password, name):
    db = DynamoDBClient()
    table = os.environ.get('USERS_TABLE')
    
    existing = db.query(table, 'email = :e', {':e': email}, index_name='email-index')
    if existing:
        raise ValueError("User with this email already exists")
        
    user_id = str(uuid.uuid4())
    hashed = hash_password(password)
    
    now = datetime.utcnow().isoformat() + "Z"
    user = {
        'userId': user_id,
        'email': email,
        'passwordHash': hashed,
        'name': name,
        'createdAt': now,
        'updatedAt': now
    }
    
    db.put_item(table, user)
    
    token = jwt.encode(
        {'userId': user_id, 'email': email, 'exp': int(datetime.utcnow().timestamp()) + 86400},
        os.environ.get('JWT_SECRET'),
        algorithm='HS256'
    )
    
    publish_user_registered({'userId': user_id, 'email': email, 'name': name})
    
    return {'userId': user_id, 'email': email, 'name': name, 'token': token}