import json

# Manages the conversation history by trimming old messages and updating the last user message.
def manage_conversation(messages, user_input):

    # Trim the messages list if it has more than 4 entries
    if len(messages) > 4:
        for _ in range(2):
            if messages:
                messages.pop(0)

    # Find and update the content of the last user message with the new user input
    last_user_index = None
    for index, entry in enumerate(messages):
        if entry["role"] == "user":
            last_user_index = index
    if last_user_index is not None:
        messages[last_user_index]["content"][0]["text"] = user_input
    return json.dumps(messages, indent=4)
