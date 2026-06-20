import json
from src.services.business.create import create_business

def handler(event, context):
    try:
        user_id = event['requestContext']['authorizer']['userId']
        body = json.loads(event.get('body', '{}'))
        
        result = create_business(user_id, body)
        return {'statusCode': 201, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps(result)}
    except ValueError as e:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': str(e)})}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Internal server error'})}
