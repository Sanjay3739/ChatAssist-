from flask import session
from src.service.question_generator import generate_standalone_question
from src.service.bedrock_integration import bedrock_conversation
from src.service.conversation_manager import manage_conversation
from src.service.instructional_prompts import system_prompt, user_prompt
from src.utils.config import ANSWER_ERROR_MESSAGE, ANSWER_NOT_FOUND_MESSAGE
from src.service.pdf_vector_store_manager import vectorstore
import json

# Processes user input, generates a response using a conversation model, and manages the conversation state.
def generate_response(user_input):
    # Retrieve the conversation messages from the session
    messages = session["messages"]

    if isinstance(messages, str):
        messages = json.loads(messages)

    # Generate a standalone question if there are previous messages
    if messages:
        formated_user_input = generate_standalone_question(
            messages=json.dumps(messages, indent=2), user_input=user_input
        )
        formated_user_input = (
            formated_user_input.replace("\n", " ")
            .replace("`", "")
            .replace("_", "")
            .replace("|", "")
            .replace("-", "")
        )
    else:
        formated_user_input = user_input

    # perform a similarity search
    results = vectorstore.similarity_search(formated_user_input, k=5)
    if not results:
        return {"question": user_input, "answer": ANSWER_NOT_FOUND_MESSAGE}
    
    combined_results = " ".join([result.page_content for result in results])

    # Format the user prompt with the combined results and user input
    prompt = user_prompt.format(
        combined_results=combined_results, user_input=user_input
    )

    messages.append({"role": "user", "content": [{"text": prompt}]})

    try:
        # Invoke the conversation model with the system prompt and messages
        response = bedrock_conversation(system_prompt, messages)
        messages.append(response["output"]["message"])

        # Manage the conversation by trimming old messages if necessary
        session["messages"] = manage_conversation(messages, user_input)

        if "text" in response["output"]["message"]["content"][0]:
            assistant_response = response["output"]["message"]["content"][0]["text"]
        else:
            assistant_response = ANSWER_NOT_FOUND_MESSAGE

        return {"question": user_input, "answer": assistant_response}

    except Exception as err:
        print(ANSWER_ERROR_MESSAGE, err.response["Error"]["Message"])
