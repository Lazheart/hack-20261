import os
import uuid
import bcrypt
import boto3
from datetime import datetime, timedelta
from src.database.dynamodb import DynamoDBClient

def recover_password(email):
    db = DynamoDBClient()
    table = os.environ.get('USERS_TABLE')
    
    users = db.query(table, 'email = :e', {':e': email}, index_name='email-index')
    if not users:
        return # Do not leak info
        
    user = users[0]
    token = str(uuid.uuid4())
    salt = bcrypt.gensalt(rounds=12)
    hashed_token = bcrypt.hashpw(token.encode('utf-8'), salt).decode('utf-8')
    
    ttl = int((datetime.utcnow() + timedelta(hours=1)).timestamp())
    
    db.update_item(
        table,
        {'userId': user['userId']},
        'SET recoveryToken = :rt, recoveryTTL = :ttl',
        {':rt': hashed_token, ':ttl': ttl}
    )
    
    # For now we use SES
    # Read template
    with open('src/templates/recovery.html', 'r') as f:
        template = f.read()
        
    recovery_link = f"https://easycommerce.app/recover?token={token}&email={email}"
    html = template.replace('{{ name }}', user['name']).replace('{{ recovery_link }}', recovery_link).replace('{{ expiry_time }}', '1 hora')
    
    ses = boto3.client('ses')
    try:
        ses.send_email(
            Source='noreply@easycommerce.app',
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'Recuperacion de Contrasena - EasyCommerce'},
                'Body': {'Html': {'Data': html}}
            }
        )
        print(f"[INFO] Recovery email sent to {email}")
    except Exception as e:
        print(f"[ERROR] SES send error: {e}")
