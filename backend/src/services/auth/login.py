import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from src.database.dynamodb import DynamoDBClient

def login_user(email, password):
    db = DynamoDBClient()
    table = os.environ.get('USERS_TABLE')
    
    users = db.query(table, 'email = :e', {':e': email}, index_name='email-index')
    if not users:
        raise ValueError("Invalid credentials")
        
    user = users[0]
    if not bcrypt.checkpw(password.encode('utf-8'), user['passwordHash'].encode('utf-8')):
        raise ValueError("Invalid credentials")
        
    exp = datetime.utcnow() + timedelta(hours=24)
    token = jwt.encode({
        'userId': user['userId'],
        'email': user['email'],
        'exp': int(exp.timestamp())
    }, os.environ.get('JWT_SECRET'), algorithm='HS256')
    
    return {
        'token': token,
        'userId': user['userId'],
        'email': user['email'],
        'name': user['name']
    }
