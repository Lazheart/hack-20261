import boto3
import json
import os
from datetime import datetime

def publish_business_created(business: dict):
    client = boto3.client('events', region_name='us-east-1')
    
    response = client.put_events(
        Entries=[
            {
                'Source': 'easycommerce.business',
                'DetailType': 'business.created',
                'Detail': json.dumps(business),
                'EventBusName': os.environ.get('EVENT_BUS_NAME', 'easycommerce-bus'),
                'Time': datetime.now()
            }
        ]
    )
    
    return response