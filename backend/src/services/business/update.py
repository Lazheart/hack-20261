import os
from datetime import datetime
from src.database.dynamodb import DynamoDBClient
from src.services.business.read import read_one
from src.events.business_events import publish_business_updated

def update_business(business_id, user_id, data):
    db = DynamoDBClient()
    table = os.environ.get('BUSINESSES_TABLE')
    
    # Validate ownership
    read_one(business_id, user_id)
    
    if not data:
        raise ValueError("No data provided for update")
        
    update_expr = "SET updatedAt = :upd"
    expr_vals = {':upd': datetime.utcnow().isoformat() + "Z"}
    expr_names = {}
    
    for k, v in data.items():
        if k in ['businessId', 'userId', 'createdAt', 'updatedAt']:
            continue
        update_expr += f", #n_{k} = :v_{k}"
        expr_names[f"#n_{k}"] = k
        expr_vals[f":v_{k}"] = v
        
    updated = db.update_item(table, {'businessId': business_id}, update_expr, expr_vals, expr_names)
    publish_business_updated(updated)
    
    return updated
