import os
import jwt

def handler(event, context):
    token = event.get('authorizationToken', '')
    if token.startswith('Bearer '):
        token = token.split(' ')[1]
        
    try:
        payload = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=['HS256'])
        return generate_policy(payload['userId'], 'Allow', event['methodArn'])
    except Exception as e:
        print(f"[ERROR] Token validation failed: {e}")
        return generate_policy('user', 'Deny', event['methodArn'])

def generate_policy(principal_id, effect, resource):
    return {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': effect,
                'Resource': resource
            }]
        },
        'context': {
            'userId': principal_id
        }
    }
