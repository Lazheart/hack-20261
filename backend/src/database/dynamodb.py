import boto3
import os

def get_dynamodb():
    return boto3.resource('dynamodb', region_name='us-east-1')

def get_table(table_name):
    dynamodb = get_dynamodb()
    return dynamodb.Table(table_name)

BUSINESSES_TABLE = os.environ.get('BUSINESSES_TABLE', 'EasyCommerceBusinesses')
REPORTS_TABLE = os.environ.get('REPORTS_TABLE', 'EasyCommerceReports')