BUSINESSES_TABLE_SCHEMA = {
    'TableName': 'EasyCommerceBusinesses',
    'KeySchema': [
        {'AttributeName': 'id', 'KeyType': 'HASH'},
    ],
    'AttributeDefinitions': [
        {'AttributeName': 'id', 'AttributeType': 'S'},
    ],
    'BillingMode': 'PAY_PER_REQUEST'
}

REPORTS_TABLE_SCHEMA = {
    'TableName': 'EasyCommerceReports',
    'KeySchema': [
        {'AttributeName': 'business_id', 'KeyType': 'HASH'},
    ],
    'AttributeDefinitions': [
        {'AttributeName': 'business_id', 'AttributeType': 'S'},
    ],
    'BillingMode': 'PAY_PER_REQUEST'
}