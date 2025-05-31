from dotenv import load_dotenv
import os

# LOAD ENVIROMENT VARIABLES
load_dotenv()

# CONSTANTS
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100
PDF_FILE_PATH = ["./src/documents/sunlexbuddy.pdf"]
SECRET_KEY = os.getenv("SECRET_KEY")

#mongodb configurations
INDEX_NAME = os.getenv("INDEX_NAME")
ATLAS_CONNECTION_STRING = os.getenv("ATLAS_CONNECTION_STRING")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

# AWS BEDROCK MODEL CONFIGRATION
BEDROCK_CLIENT = "bedrock-runtime"
REGION = os.getenv("REGION")
MODEL_NAME = os.getenv("MODEL_NAME")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# HUGGINGFACE MODEL CONFIGURATION
EMBEDDING_MODEL_NAME = (
    "sentence-transformers/all-MiniLM-L6-v2"  # embedding dimention (384)
)

# ERROR MESSAGE
ANSWER_NOT_FOUND_MESSAGE = "I am sunlexbuddy's virtual assistant. I'm unable to provide an answer to your question. If you have any other queries related to sunlexbuddy, please feel free to ask."
ANSWER_ERROR_MESSAGE = "Failed to answer query "
