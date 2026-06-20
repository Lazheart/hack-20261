import os
from datetime import datetime
from src.database.dynamodb import DynamoDBClient
from src.services.business.read import read_one
from src.events.business_events import publish_business_deleted

def delete_business(business_id, user_id):
    db = DynamoDBClient()
    table = os.environ.get('BUSINESSES_TABLE')
    
    # Validate ownership
    read_one(business_id, user_id)
    
    now = datetime.utcnow().isoformat() + "Z"
    db.update_item(
        table,
        {'businessId': business_id},
        "SET deletedAt = :d, updatedAt = :u",
        {':d': now, ':u': now}
    )
    
    publish_business_deleted(business_id, user_id)
    return True
