import boto3
import json
import os

def publish_event(source, detail_type, payload):
    client = boto3.client('events')
    try:
        client.put_events(Entries=[{
            'Source': source,
            'DetailType': detail_type,
            'Detail': json.dumps(payload),
            'EventBusName': os.environ['EVENT_BUS_NAME']
        }])
        print(f"[INFO] Event published: {detail_type}")
    except Exception as e:
        print(f"[ERROR] Failed to publish event {detail_type}: {str(e)}")
        raise

def publish_user_registered(user_data):
    publish_event("easycommerce.auth", "auth.user.registered", user_data)
