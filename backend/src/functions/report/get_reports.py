import json
from src.services.report.report import get_by_id, list_by_user

def handler(event, context):
    try:
        user_id = event['requestContext']['authorizer']['userId']
        path_params = event.get('pathParameters')
        
        if path_params and 'id' in path_params:
            result = get_by_id(path_params['id'])
            if not result or result.get('userId') != user_id:
                return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Not found'})}
        else:
            result = list_by_user(user_id)
            
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps(result)}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Internal server error'})}
