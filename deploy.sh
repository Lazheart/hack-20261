#!/bin/bash

echo "Finding AWS Credentials"
if [[ -f ~/.aws/credentials ]]; then
    cat ~/.aws/credentials
else
    echo "No AWS Credentials found"
fi

echo "Finding serverless.yml"
if [[ -f backend/serverless.yml ]]; then
    echo "serverless.yml found"
else
    echo "serverless.yml not found"
fi

echo "Finding .env"
if [[ -f backend/.env ]]; then
    echo ".env found"
else
    echo ".env not found"
fi

echo "Deploying backend"

serverless deploy --stage dev

echo "Backend deployed successfully"