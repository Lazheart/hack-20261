import json
from src.services.business.delete import delete_business

def handler(event, context):
    try:
        user_id = event['requestContext']['authorizer']['userId']
        business_id = event['pathParameters']['id']
        
        delete_business(business_id, user_id)
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'message': 'Deleted successfully'})}
    except ValueError as e:
        return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': str(e)})}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Internal server error'})}
