# Customer Support Chatbot

This repository contains a Flask-based web application that serves as a customer support chatbot for me. The chatbot can process queries related to PDF documents and provide relevant information based on the content.

## Table of Contents

- Features
- Requirements
- Installation
- Configuration
- Running the Application
- Usage
- Project Structure
- Code Explanation
- Example Output

## Features

- Extracts text from a PDF file
- Splits the text into manageable chunks
- Uses MongoDB for vector storage and vector search
- Integrates with AWS Bedrock for generating responses using a specified model.
- Handles user queries by rephrasing follow-up questions into standalone questions for better understanding and response generation.
- Maintains conversation context across multiple interactions using Flask sessions.
- Provides a web interface for users to input queries and receive responses from the virtual assistant.

## Requirements

1. **Python 3.9 or higher**
2. **AWS Account**: Ensure you have the necessary permissions to use Bedrock services.
3. **Huggingface API Token**: Required to access Huggingface models and services.
4. **MongoDB**: Ensure you have a MongoDB Atlas account and an appropriate connection string.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanjay3739/ChatAssist-.git
   cd ChatAssist
   ```

2. **Create a virtual environment and activate:**
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. Create a `.env` file in the root directory of the project and add your AWS credentials and other configuration details:
    ```dotenv
    # AWS Bedrock credentials
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    REGION=your_aws_region
    MODEL_NAME=your_aws_model

    # MongoDB credentials
    ATLAS_CONNECTION_STRING = your_mongodb_connection_string
    DB_NAME = your_mongodb_database_name
    COLLECTION_NAME = your_mongodb_collection_name
    INDEX_NAME = your_mongodb_vector_search_index_name

    # Hugging Face credentials
    HUGGINGFACEHUB_API_TOKEN=your_hf_api_token

    # Generated 16-byte hexadecimal string 
    SECRET_KEY=your_app_secret_key
    ```

2. Place the PDF file you want to use in the src/documents directory and update the `PDF_FILE_PATH` variable in the code if needed.

## Running the Application

follow these steps to run the app:

1. **Run the Flask application:**

    ```bash
    python main.py
    ```

4. **Access the application:** 
Open your web browser and go to `http://127.0.0.1:5014/`. 

## Usage

This demo enhances the response generation by:
- Extracting and chunking text from a specified PDF file.
- Using vector search to find relevant text chunks based on the user's query.
- Generating responses using AWS Bedrock models.

## Project Structure

This project is organized for clarity and efficiency. Key files at the root include `.env` for environment variables, `.gitignore` for version control, `main.py` as the entry point, `output.png`, `README.md`, and `requirements.txt`.

Within the `src` directory:

- `__init__.py` initializes the package.
- `routes.py` defines app routes.
- `documents/` contains a project Files.
- `models/` handles models configurations.
- `service/` contains modules for Bedrock integration, conversation logic, PDF & vector store manager, instruction prompts, database connection, standalone question generator, and response generator.
- `statics/` includes `css/`, `images/`, and `js/`.
- `templates/index.html` is the main HTML template.
- `utils/config.py` handles configuration.

This structure ensures organized, maintainable, and extendable code.

## Code Explanation

- **Libraries:** Libraries such as Flask, PyPDF2, LangChain components, and the AWS Bedrock client are imported to facilitate web application development, PDF reading, text processing, embeddings, and interaction with AWS services.
- **Environment Variables:** AWS credentials and other configurations are securely loaded from the `.env` file to keep sensitive information out of the codebase.
- **PDF Text Extraction:** The `documents/your.pdf` file is read, and its text is extracted using PyPDF2. The text is then split into manageable chunks using LangChain's text splitter.
- **Vector Store Preparation:** The text chunks are converted into embeddings using a model from HuggingFace and stored in a vector database using MongoDB, which enables efficient similarity searches.
- **Session Management:**  Initializes a session to maintain conversation context across multiple user interactions. The session stores the conversation history.
- **Query Processing:** Handles user queries by first rephrasing follow-up questions into standalone questions using AWS Bedrock. It then generates query embeddings and retrieves the most relevant text chunks from the vector store using similarity search techniques.
- **Response Generation:** This function interacts with AWS Bedrock to generate context-aware responses based on the system prompts and user messages.
