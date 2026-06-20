import os
import uuid
from datetime import datetime
from src.database.dynamodb import DynamoDBClient
from src.events.business_events import publish_business_created

def create_business(user_id, data):
    required = ['name', 'sector', 'employeeCount']
    for req in required:
        if req not in data:
            raise ValueError(f"Missing required field: {req}")
            
    db = DynamoDBClient()
    table = os.environ.get('BUSINESSES_TABLE')
    
    business_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    business = {
        'businessId': business_id,
        'userId': user_id,
        'name': data['name'],
        'sector': data['sector'],
        'employeeCount': data['employeeCount'],
        'annualRevenue': data.get('annualRevenue', 0),
        'currentTools': data.get('currentTools', []),
        'painPoints': data.get('painPoints', []),
        'digitalPresence': data.get('digitalPresence', {'hasWebsite': False, 'hasSocialMedia': False}),
        'location': data.get('location', ''),
        'createdAt': now,
        'updatedAt': now
    }
    
    db.put_item(table, business)
    publish_business_created(business)
    
    return business
