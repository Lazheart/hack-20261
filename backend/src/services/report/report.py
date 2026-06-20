import os
from src.database.dynamodb import DynamoDBClient

def generate_report(business_data, recommendation_data) -> dict:
    # Consolidate
    report = {
        'business': business_data,
        'recommendation': recommendation_data,
        'metrics': {
            'top3_priorities': recommendation_data.get('priorityActions', [])[:3],
            'digitalization_score': recommendation_data.get('digitalMaturityScore', 0)
        }
    }
    return report

def get_by_business(business_id):
    db = DynamoDBClient()
    table = os.environ.get('REPORTS_TABLE')
    reports = db.query(table, 'businessId = :b', {':b': business_id}, index_name='businessId-index')
    if reports:
        return sorted(reports, key=lambda x: x.get('generatedAt', ''), reverse=True)[0]
    return None

def get_by_id(report_id):
    db = DynamoDBClient()
    table = os.environ.get('REPORTS_TABLE')
    return db.get_item(table, {'reportId': report_id})

def list_by_user(user_id):
    db = DynamoDBClient()
    table = os.environ.get('REPORTS_TABLE')
    # scan for now, since we dont have userId index on Reports table in requirement, but we can filter
    all_reports = db.scan(table)
    return [r for r in all_reports if r.get('userId') == user_id]
