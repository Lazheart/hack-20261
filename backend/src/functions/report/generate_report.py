import json
import os
from datetime import datetime
from src.services.report.report import generate_report
from src.database.dynamodb import DynamoDBClient
from src.events.report_events import publish_report_generated

def handler(event, context):
    try:
        detail = event.get('detail', {})
        if not detail or 'reportId' not in detail:
            print("[ERROR] No recommendation data in event detail")
            return
            
        # We assume recommendation_data is in detail, and business_data should be fetched or is in detail
        # Since detail is the recommendation record from DB
        
        db = DynamoDBClient()
        reports_table = os.environ.get('REPORTS_TABLE')
        businesses_table = os.environ.get('BUSINESSES_TABLE')
        
        business_data = db.get_item(businesses_table, {'businessId': detail['businessId']})
        
        final_report = generate_report(business_data, detail)
        
        # update the report in dynamo to include final structure if needed, or save to S3
        db.update_item(
            reports_table,
            {'reportId': detail['reportId']},
            "SET finalReport = :f, updatedAt = :u",
            {':f': final_report, ':u': datetime.utcnow().isoformat() + "Z"}
        )
        
        publish_report_generated(final_report)
        print(f"[INFO] Final report generated for report {detail['reportId']}")
        
    except Exception as e:
        print(f"[ERROR] generate_report: {e}")
        raise
