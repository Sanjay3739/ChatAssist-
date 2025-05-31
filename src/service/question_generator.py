from src.service.bedrock_integration import invoke_bedrock_model
from src.service.instructional_prompts import question_generator_prompt
import json

# Generates a standalone question from a follow-up user input within a conversation context.
def generate_standalone_question(messages, user_input):
    prompt = question_generator_prompt.format(messages=messages, user_input=user_input)
    body = {"prompt": prompt, "temperature": 0, "max_gen_len": 50}

    # Invoke the Bedrock model to generate the standalone question
    response = invoke_bedrock_model(body)

    response_body = json.loads(response["body"].read().decode("utf-8"))
    return response_body.get("generation")
