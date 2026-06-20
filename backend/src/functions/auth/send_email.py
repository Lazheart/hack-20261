import boto3
from botocore.exceptions import ClientError
import time

def send_email_with_retry(source, to_addresses, subject, html_body, max_retries=3):
    ses = boto3.client('ses')
    for attempt in range(max_retries):
        try:
            response = ses.send_email(
                Source=source,
                Destination={'ToAddresses': to_addresses},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {'Html': {'Data': html_body}}
                }
            )
            print(f"[INFO] Email sent! Message ID: {response['MessageId']}")
            return True
        except ClientError as e:
            print(f"[ERROR] SES error: {e}")
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
