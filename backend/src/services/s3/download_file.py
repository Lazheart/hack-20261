import boto3
import os
from botocore.exceptions import ClientError

def download_file(key: str) -> bytes:
    s3_client = boto3.client('s3')
    bucket = os.environ.get('REPORTS_BUCKET')
    try:
        response = s3_client.get_object(Bucket=bucket, Key=key)
        return response['Body'].read()
    except ClientError as e:
        print(f"[ERROR] S3 download error for key {key}: {e}")
        raise

def get_presigned_url(key: str, expiration: int = 3600) -> str:
    s3_client = boto3.client('s3')
    bucket = os.environ.get('REPORTS_BUCKET')
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        print(f"[ERROR] S3 generate url error for key {key}: {e}")
        raise
