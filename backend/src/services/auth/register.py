import os
import uuid
import bcrypt
from datetime import datetime
from src.database.dynamodb import DynamoDBClient
from src.events.auth_events import publish_user_registered

def register_user(email, password, name):
    db = DynamoDBClient()
    table = os.environ.get('USERS_TABLE')
    
    # Check if user exists
    existing = db.query(table, 'email = :e', {':e': email}, index_name='email-index')
    if existing:
        raise ValueError("User with this email already exists")
        
    user_id = str(uuid.uuid4())
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
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
    
    import jwt
    token = jwt.encode({'userId': user_id, 'email': email, 'exp': datetime.utcnow().timestamp() + 86400}, os.environ.get('JWT_SECRET'), algorithm='HS256')
    
    publish_user_registered({
        'userId': user_id,
        'email': email,
        'name': name
    })
    
    return {
        'userId': user_id,
        'email': email,
        'name': name,
        'token': token
    }
