import os
from src.database.dynamodb import DynamoDBClient

def read_one(business_id, user_id):
    db = DynamoDBClient()
    table = os.environ.get('BUSINESSES_TABLE')
    
    business = db.get_item(table, {'businessId': business_id})
    if not business or business.get('userId') != user_id or business.get('deletedAt'):
        raise ValueError("Business not found or access denied")
        
    return business

def read_all(user_id):
    db = DynamoDBClient()
    table = os.environ.get('BUSINESSES_TABLE')
    
    businesses = db.query(table, 'userId = :u', {':u': user_id}, index_name='userId-index')
    return [b for b in businesses if not b.get('deletedAt')]
