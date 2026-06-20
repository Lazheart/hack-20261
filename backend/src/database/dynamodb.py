import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer

class DynamoDBClient:
    def __init__(self):
        self.client = boto3.client('dynamodb')
        self.serializer = TypeSerializer()
        self.deserializer = TypeDeserializer()

    def _serialize(self, data):
        return {k: self.serializer.serialize(v) for k, v in data.items()}

    def _deserialize(self, data):
        return {k: self.deserializer.deserialize(v) for k, v in data.items()}

    def put_item(self, table_name, item):
        try:
            self.client.put_item(TableName=table_name, Item=self._serialize(item))
            return True
        except ClientError as e:
            print(f"[ERROR] DynamoDB put_item: {e}")
            raise

    def get_item(self, table_name, key):
        try:
            response = self.client.get_item(TableName=table_name, Key=self._serialize(key))
            if 'Item' in response:
                return self._deserialize(response['Item'])
            return None
        except ClientError as e:
            print(f"[ERROR] DynamoDB get_item: {e}")
            raise

    def update_item(self, table_name, key, update_expression, expression_values, expression_names=None):
        try:
            kwargs = {
                'TableName': table_name,
                'Key': self._serialize(key),
                'UpdateExpression': update_expression,
                'ExpressionAttributeValues': self._serialize(expression_values),
                'ReturnValues': 'ALL_NEW'
            }
            if expression_names:
                kwargs['ExpressionAttributeNames'] = expression_names
            response = self.client.update_item(**kwargs)
            return self._deserialize(response.get('Attributes', {}))
        except ClientError as e:
            print(f"[ERROR] DynamoDB update_item: {e}")
            raise

    def delete_item(self, table_name, key):
        try:
            self.client.delete_item(TableName=table_name, Key=self._serialize(key))
            return True
        except ClientError as e:
            print(f"[ERROR] DynamoDB delete_item: {e}")
            raise

    def query(self, table_name, key_condition, expression_values, index_name=None):
        try:
            kwargs = {
                'TableName': table_name,
                'KeyConditionExpression': key_condition,
                'ExpressionAttributeValues': self._serialize(expression_values)
            }
            if index_name:
                kwargs['IndexName'] = index_name
            response = self.client.query(**kwargs)
            return [self._deserialize(i) for i in response.get('Items', [])]
        except ClientError as e:
            print(f"[ERROR] DynamoDB query: {e}")
            raise

    def scan(self, table_name):
        try:
            response = self.client.scan(TableName=table_name)
            return [self._deserialize(i) for i in response.get('Items', [])]
        except ClientError as e:
            print(f"[ERROR] DynamoDB scan: {e}")
            raise