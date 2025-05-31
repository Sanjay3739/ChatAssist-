from src.utils.config import (
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    REGION,
    BEDROCK_CLIENT,
    MODEL_NAME
)
import boto3
import json

# Initialize the Bedrock client using AWS credentials and region
bedrock = boto3.client(
    BEDROCK_CLIENT,
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

# Invokes the specified Bedrock model with the provided body data.
def invoke_bedrock_model(body):
    return bedrock.invoke_model(
        body=json.dumps(body),
        modelId=MODEL_NAME,
        accept="application/json",
        contentType="application/json",
    )

# Initiates a conversation with the Bedrock model using system prompts and messages.
def bedrock_conversation(system_prompts, messages):
    return bedrock.converse(
        modelId=MODEL_NAME,
        messages=messages,
        system=system_prompts,
        inferenceConfig={"temperature": 0},
    )
