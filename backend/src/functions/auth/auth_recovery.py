import json
from src.services.auth.recovery import recover_password

def handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        
        if not email:
            return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Missing fields'})}
            
        recover_password(email)
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'message': 'If the email exists, a recovery link was sent.'})}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,Authorization'}, 'body': json.dumps({'error': 'Internal server error'})}
