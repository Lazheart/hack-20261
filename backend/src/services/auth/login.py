import os
import jwt
import hashlib
import hmac
from datetime import datetime, timedelta
from src.database.dynamodb import DynamoDBClient

def verify_password(password: str, stored: str) -> bool:
    salt, hashed = stored.split(":")
    return hmac.new(salt.encode(), password.encode(), hashlib.sha256).hexdigest() == hashed

def login_user(email, password):
    db = DynamoDBClient()
    table = os.environ.get('USERS_TABLE')
    
    users = db.query(table, 'email = :e', {':e': email}, index_name='email-index')
    if not users:
        raise ValueError("Invalid credentials")
        
    user = users[0]
    if not verify_password(password, user['passwordHash']):
        raise ValueError("Invalid credentials")
        
    exp = datetime.utcnow() + timedelta(hours=24)
    token = jwt.encode({
        'userId': user['userId'],
        'email': user['email'],
        'exp': int(exp.timestamp())
    }, os.environ.get('JWT_SECRET'), algorithm='HS256')
    
    return {
        'token': token,
        'user': {
            'userId': user['userId'],
            'email': user['email'],
            'name': user['name']
        }
    }