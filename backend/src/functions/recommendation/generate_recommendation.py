import json
import os
import uuid
from datetime import datetime
from src.services.recommendation.recommendation import generate
from src.database.dynamodb import DynamoDBClient
from src.events.recommendation_events import publish_recommendation_generated

def handler(event, context):
    try:
        # Extraer data de EventBridge
        detail = event.get('detail', {})
        
        # Validar si tiene lo necesario
        if not detail or 'businessId' not in detail:
            print("[ERROR] No business data in event detail")
            return
            
        recommendation = generate(detail)
        
        db = DynamoDBClient()
        table = os.environ.get('REPORTS_TABLE')
        
        report_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat() + "Z"
        
        report_data = {
            'reportId': report_id,
            'businessId': detail['businessId'],
            'userId': detail['userId'],
            'recommendations': recommendation['recommendations'],
            'digitalMaturityScore': recommendation['digitalMaturityScore'],
            'priorityActions': recommendation['priorityActions'],
            'generatedAt': now,
            'version': 1,
            'full_analysis': recommendation
        }
        
        db.put_item(table, report_data)
        publish_recommendation_generated(report_data)
        
        print(f"[INFO] Recommendation generated for business {detail['businessId']}")
        
    except Exception as e:
        print(f"[ERROR] generate_recommendation: {e}")
        raise
