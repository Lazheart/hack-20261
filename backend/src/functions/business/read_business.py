import json
from src.services.business.read import read_one, read_all

def handler(event, context):
    try:
        user_id = event['requestContext']['authorizer']['userId']
        path_params = event.get('pathParameters')
        
        if path_params and 'id' in path_params:
            result = read_one(path_params['id'], user_id)
        else:
            result = read_all(user_id)
            
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps(result)}
    except ValueError as e:
        return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': str(e)})}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Internal server error'})}
