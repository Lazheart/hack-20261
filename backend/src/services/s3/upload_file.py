import boto3
import os
from botocore.exceptions import ClientError

def upload_file(file_content: bytes, key: str, content_type: str) -> str:
    s3_client = boto3.client('s3')
    bucket = os.environ.get('REPORTS_BUCKET')
    try:
        s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=file_content,
            ContentType=content_type
        )
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=7 * 24 * 3600
        )
        print(f"[INFO] File uploaded to {bucket}/{key}")
        return url
    except ClientError as e:
        print(f"[ERROR] S3 upload error: {e}")
        raise
